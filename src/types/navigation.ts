export interface NavItem {
  href: string
  label: string
}

export interface NavDropdownItem {
  label: string
  items: NavItem[]
}

export type NavigationItem = NavItem | NavDropdownItem

export function isNavDropdown(item: NavigationItem): item is NavDropdownItem {
  return 'items' in item
}

export function isNavItem(item: NavigationItem): item is NavItem {
  return 'href' in item
}

