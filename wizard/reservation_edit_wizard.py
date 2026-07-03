# -*- coding: utf-8 -*-

from odoo import api, fields, models
from odoo.exceptions import UserError

class ReservationEditWizard(models.TransientModel):
    _name = 'tipd_hotel.reservation.edit.wizard'
    _description = 'Edit Reservation Wizard'

    folio_line_id = fields.Many2one('tipd_hotel.folio.line', string='Reservation', required=True)
    
    # Old Details (Read-only)
    old_checkin = fields.Datetime(string='Old Check-In', related='folio_line_id.checkin_date', readonly=True)
    old_checkout = fields.Datetime(string='Old Check-Out', related='folio_line_id.checkout_date', readonly=True)
    old_room_id = fields.Many2one('product.product', string='Old Room', related='folio_line_id.product_id', readonly=True)
    
    # New Details
    new_checkin = fields.Datetime(string='New Check-In', required=True)
    new_checkout = fields.Datetime(string='New Check-Out', required=True)
    new_room_id = fields.Many2one('product.product', string='New Room', domain="[('isroom', '=', True)]", required=True)

    @api.model
    def default_get(self, fields):
        res = super(ReservationEditWizard, self).default_get(fields)
        if 'folio_line_id' in res:
            folio_line = self.env['tipd_hotel.folio.line'].browse(res['folio_line_id'])
            res['new_checkin'] = folio_line.checkin_date
            res['new_checkout'] = folio_line.checkout_date
            res['new_room_id'] = folio_line.product_id.id
        return res

    def action_save(self):
        if self.new_checkin >= self.new_checkout:
            raise UserError('Check-out date must be strictly after the check-in date.')
            
        # Optional: Add availability check here if you want
        
        # Bypass Odoo restriction on modifying product_id for confirmed sales
        order = self.folio_line_id.order_id
        original_state = order.state
        original_locked = order.locked if hasattr(order, 'locked') else False

        if original_state != 'draft':
            order.write({'state': 'draft'})
            if original_locked:
                order.write({'locked': False})
            
        self.folio_line_id.write({
            'checkin_date': self.new_checkin,
            'checkout_date': self.new_checkout,
            'product_id': self.new_room_id.id
        })
        
        # Restore state
        if original_state != 'draft':
            order.write({'state': original_state})
            if original_locked:
                order.write({'locked': True})
        
        # In Odoo, client actions can be told to reload
        return {'type': 'ir.actions.act_window_close'}
