/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

export class DashboardClientAction extends Component {
    setup() {
        this.orm = useService("orm");
        this.action = useService("action");
        
        this.state = useState({
            kpis: {
                today_booking_count: 0,
                total_booking_count: 0,
                today_revenue: 0.0,
                total_revenue: 0.0,
                today_arrival_count: 0,
                today_departure_count: 0
            },
            recent_bookings: []
        });

        onWillStart(async () => {
            await this.loadData();
        });
    }

    async loadData() {
        try {
            const data = await this.orm.call("tipd_hotel.folio", "get_dashboard_data", []);
            if (data) {
                this.state.kpis = {
                    today_booking_count: data.today_booking_count || 0,
                    total_booking_count: data.total_booking_count || 0,
                    today_revenue: data.today_revenue || 0.0,
                    total_revenue: data.total_revenue || 0.0,
                    today_arrival_count: data.today_arrival_count || 0,
                    today_departure_count: data.today_departure_count || 0
                };
                this.state.recent_bookings = data.recent_bookings || [];
            }
        } catch (e) {
            console.error("Error loading dashboard data", e);
        }
    }

    openFolio(folioId) {
        this.action.doAction({
            type: "ir.actions.act_window",
            res_model: "tipd_hotel.folio",
            res_id: folioId,
            views: [[false, "form"]],
            target: "current"
        });
    }
}

DashboardClientAction.template = "tipd_hotel.DashboardClientAction";

registry.category("actions").add("tipd_hotel_dashboard", DashboardClientAction);
