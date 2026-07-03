# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request


class FrontdeskController(http.Controller):

    @http.route('/tipd_hotel/get_frontdesk_data', type='json', auth='user')
    def get_frontdesk_data(self, start_date=None, end_date=None):
        """
        Fetch rooms and reservations to display on the Frontdesk timeline.
        start_date and end_date should be strings.
        """
        # 1. Fetch Rooms grouped by Room Type
        room_types = request.env['tipd_hotel.room.type'].search([])
        rooms = request.env['tipd_hotel.room'].search([('isroom', '=', True)])
        
        rooms_data = []
        for rtype in room_types:
            r_type_data = {
                'id': rtype.id,
                'name': rtype.name,
                'rooms': []
            }
            # Find rooms belonging to this type (category)
            rtype_rooms = rooms.filtered(lambda r: r.room_categ_id.id == rtype.id)
            for rm in rtype_rooms:
                r_type_data['rooms'].append({
                    'id': rm.id,
                    'name': rm.name,
                    'product_id': rm.product_id.id
                })
            
            if r_type_data['rooms']:
                rooms_data.append(r_type_data)
        
        # 2. Fetch Reservations (Folio Lines)
        domain = []
        if start_date:
            domain.append(('checkout_date', '>=', start_date))
        if end_date:
            domain.append(('checkin_date', '<=', end_date))
            
        reservations = request.env['tipd_hotel.folio.line'].search(domain)
        
        reservations_data = []
        for res in reservations:
            # check the state from the folio's order
            state = res.folio_id.state
            status_map = {
                'draft': 'Draft',
                'sent': 'Quotation Sent',
                'sale': 'Reserved',
                'done': 'Done',
                'cancel': 'Cancelled'
            }
            status_text = status_map.get(state, state)
            
            reservations_data.append({
                'id': res.id,
                'folio_id': res.folio_id.id,
                'folio_name': res.folio_id.name,
                'guest_name': res.folio_id.partner_id.name,
                'room_id': res.product_id.id, # Product product ID of the room
                'room_name': res.product_id.name,
                'checkin_date': res.checkin_date.strftime('%Y-%m-%d %H:%M:%S') if res.checkin_date else None,
                'checkout_date': res.checkout_date.strftime('%Y-%m-%d %H:%M:%S') if res.checkout_date else None,
                'status': status_text,
                'state': state
            })
            
        return {
            'rooms_data': rooms_data,
            'reservations_data': reservations_data
        }
