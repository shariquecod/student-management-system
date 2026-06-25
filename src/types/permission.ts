export interface Permission {
  resource: string
  action: 'view' | 'create' | 'edit' | 'delete'
}
