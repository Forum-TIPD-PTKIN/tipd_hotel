/** @odoo-module **/

import { Component, useState, onWillStart, onMounted, onPatched, useRef } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

function formatDateYYYYMMDD(d) {
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
}

export class FrontdeskClientAction extends Component {
    setup() {
        this.action = useService("action");
        this.timelineContainer = useRef("timelineContainer");
        
        this.state = useState({
            mode: "week", // week, month
            currentDate: new Date(),
            dates: [],
            rooms_data: [],
            reservations_data: []
        });

        onWillStart(async () => {
            this.updateDatesList();
            await this.fetchData();
        });

        onMounted(() => {
            this.calculatePositions();
        });

        onPatched(() => {
            this.calculatePositions();
        });
    }

    updateDatesList() {
        let dates = [];
        let start = new Date(this.state.currentDate);
        let daysToGenerate = 7;
        
        if (this.state.mode === 'week') {
            daysToGenerate = 7;
            // Align to start of week (e.g. Sunday or Monday depending on locale, we just show 7 days from currentDate)
            // Or just show 7 days starting from 3 days ago
            start.setDate(start.getDate() - 3);
        } else if (this.state.mode === 'month') {
            daysToGenerate = 30;
            start.setDate(start.getDate() - 15);
        }

        const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < daysToGenerate; i++) {
            let d = new Date(start);
            d.setDate(d.getDate() + i);
            dates.push({
                id: formatDateYYYYMMDD(d),
                label: d.getDate().toString().padStart(2, '0') + ' ' + shortMonths[d.getMonth()],
                isWeekend: d.getDay() === 0 || d.getDay() === 6,
                fullDate: d
            });
        }
        this.state.dates = dates;
    }

    async fetchData() {
        if (this.state.dates.length === 0) return;
        const startDate = this.state.dates[0].id + " 00:00:00";
        const endDate = this.state.dates[this.state.dates.length - 1].id + " 23:59:59";
        
        try {
            const response = await fetch("/tipd_hotel/get_frontdesk_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "call",
                    params: {
                        start_date: startDate,
                        end_date: endDate
                    },
                    id: Math.floor(Math.random() * 1000000000)
                })
            });
            const json = await response.json();
            const result = json.result;
            
            if (result) {
                this.state.rooms_data = result.rooms_data;
                this.state.reservations_data = result.reservations_data;
            }
        } catch (e) {
            console.error("Error fetching frontdesk data", e);
        }
    }

    calculatePositions() {
        if (!this.timelineContainer.el) return;
        
        // Map elements to get positions
        const cells = this.timelineContainer.el.querySelectorAll('.timeline-cell');
        let datePositions = {};
        let roomPositions = {};
        let colWidth = 60; // default from CSS

        cells.forEach(cell => {
            const dateId = cell.getAttribute('data-date');
            const roomId = cell.getAttribute('data-room');
            const rect = cell.getBoundingClientRect();
            const containerRect = this.timelineContainer.el.getBoundingClientRect();
            
            // Calculate relative to the container scrolling content
            // We need to add scrollTop and scrollLeft to get absolute positions within the container
            const top = cell.offsetTop;
            const left = cell.offsetLeft;
            
            if (!datePositions[dateId]) {
                datePositions[dateId] = { left: left, width: rect.width };
                colWidth = rect.width;
            }
            if (!roomPositions[roomId]) {
                roomPositions[roomId] = { top: top, height: rect.height };
            }
        });

        // Now calculate blocks
        for (let res of this.state.reservations_data) {
            const roomId = res.room_id.toString();
            if (!roomPositions[roomId]) continue; // Room not in view
            
            const checkin = new Date(res.checkin_date + "Z"); // Add Z for UTC if needed, or parse as local
            const checkout = new Date(res.checkout_date + "Z");
            
            // Find start and end cells
            const checkinStr = formatDateYYYYMMDD(checkin);
            const checkoutStr = formatDateYYYYMMDD(checkout);
            
            let leftPos = 0;
            let width = 0;
            
            if (datePositions[checkinStr]) {
                leftPos = datePositions[checkinStr].left;
            } else {
                // If checkin is before our view, start at first date
                leftPos = datePositions[this.state.dates[0].id] ? datePositions[this.state.dates[0].id].left : 200;
            }
            
            if (datePositions[checkoutStr]) {
                width = (datePositions[checkoutStr].left + datePositions[checkoutStr].width) - leftPos;
            } else {
                // If checkout is after our view, stretch to end
                const lastDate = this.state.dates[this.state.dates.length - 1].id;
                width = (datePositions[lastDate] ? datePositions[lastDate].left + datePositions[lastDate].width : leftPos + colWidth) - leftPos;
            }
            
            // Add slight padding
            res.left = leftPos + 2;
            res.width = Math.max(width - 4, colWidth - 4);
            res.top = roomPositions[roomId].top + 2;
            res.height = roomPositions[roomId].height - 4;
        }
    }

    async changeDate(action) {
        let current = new Date(this.state.currentDate);
        if (action === 'today') {
            current = new Date();
        } else if (action === 'prev') {
            let offset = this.state.mode === 'week' ? 7 : 30;
            current.setDate(current.getDate() - offset);
        } else if (action === 'next') {
            let offset = this.state.mode === 'week' ? 7 : 30;
            current.setDate(current.getDate() + offset);
        }
        this.state.currentDate = current;
        this.updateDatesList();
        await this.fetchData();
    }

    async setMode(mode) {
        this.state.mode = mode;
        this.updateDatesList();
        await this.fetchData();
    }

    openReservationPopup(res) {
        // Open wizard to edit reservation
        this.action.doAction({
            type: "ir.actions.act_window",
            name: "Change Reservation",
            res_model: "tipd_hotel.reservation.edit.wizard",
            views: [[false, "form"]],
            target: "new",
            context: {
                default_folio_line_id: res.id
            }
        });
    }
}
FrontdeskClientAction.template = "tipd_hotel.FrontdeskClientAction";

registry.category("actions").add("tipd_hotel_frontdesk", FrontdeskClientAction);
