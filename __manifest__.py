# Copyright (C) 2023-TODAY Serpent Consulting Services Pvt. Ltd. (<http://www.serpentcs.com>).
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

{
    "name": "TIPD Hotel Management",
    "version": "19.0.1.0.0",
    "author": "Sufyaldy, Odoo Community Association (OCA), Serpent Consulting \
               Services Pvt. Ltd., OpenERP SA",
    "category": "TIPD Hotel Management",
    "website": "",
    "depends": ["sale_stock", "account"],
    "license": "LGPL-3",
    "summary": "TIPD Hotel Management to Manage Folio and Hotel Configuration",
    "demo": ["demo/tipd_hotel_data.xml"],
    "data": [
        "security/tipd_hotel_security.xml",
        "security/ir.model.access.csv",
        "data/tipd_hotel_sequence.xml",
        "report/report_view.xml",
        "report/tipd_hotel_folio_report_template.xml",
        "views/tipd_hotel_folio.xml",
        "views/tipd_hotel_room.xml",
        "views/tipd_hotel_room_amenities.xml",
        "views/tipd_hotel_room_type.xml",
        "views/tipd_hotel_service_type.xml",
        "views/tipd_hotel_services.xml",
        "views/product_product.xml",
        "views/res_company.xml",
        "views/actions.xml",
        "views/frontdesk_action.xml",
        "views/menus.xml",
        "wizard/tipd_hotel_wizard.xml",
        "wizard/reservation_edit_wizard_view.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "tipd_hotel/static/src/css/room_kanban.css",
            "tipd_hotel/static/src/xml/frontdesk_template.xml",
            "tipd_hotel/static/src/js/frontdesk_action.js",
            "tipd_hotel/static/src/css/frontdesk.css",
        ],
    },
    "external_dependencies": {"python": ["python-dateutil"]},
    "images": ["static/description/Hotel.png"],
    "application": True,
}
