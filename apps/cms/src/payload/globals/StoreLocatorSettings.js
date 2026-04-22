import { isStaff } from '../access/content.js'

export const StoreLocatorSettings = {
  slug: 'store-locator-settings',
  label: 'Store Locator Settings',
  access: {
    read: () => true,
    update: isStaff,
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable interactive map',
      defaultValue: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'defaultCenterLat',
          type: 'number',
          required: true,
          defaultValue: -6.2,
          min: -90,
          max: 90,
        },
        {
          name: 'defaultCenterLng',
          type: 'number',
          required: true,
          defaultValue: 106.816666,
          min: -180,
          max: 180,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'defaultZoom',
          type: 'number',
          required: true,
          defaultValue: 11,
          min: 2,
          max: 20,
        },
        {
          name: 'selectedZoom',
          type: 'number',
          required: true,
          defaultValue: 14,
          min: 2,
          max: 20,
        },
        {
          name: 'maxZoom',
          type: 'number',
          required: true,
          defaultValue: 18,
          min: 2,
          max: 22,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fitBoundsPadding',
          type: 'number',
          required: true,
          defaultValue: 32,
          min: 0,
          max: 200,
        },
        {
          name: 'markerRadius',
          type: 'number',
          required: true,
          defaultValue: 8,
          min: 4,
          max: 24,
        },
      ],
    },
    {
      name: 'markerColor',
      type: 'text',
      required: true,
      defaultValue: '#1f2937',
      admin: {
        description: 'Hex color for unselected markers, e.g. #1f2937',
      },
    },
    {
      name: 'selectedMarkerColor',
      type: 'text',
      required: true,
      defaultValue: '#2563eb',
      admin: {
        description: 'Hex color for selected marker, e.g. #2563eb',
      },
    },
    {
      name: 'tileUrl',
      type: 'text',
      required: true,
      defaultValue: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    },
    {
      name: 'tileAttribution',
      type: 'text',
      required: true,
      defaultValue: '&copy; OpenStreetMap contributors',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'scrollWheelZoom',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'dragging',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'touchZoom',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'doubleClickZoom',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'showZoomControl',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showPopupDirections',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
