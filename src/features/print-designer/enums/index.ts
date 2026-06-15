export enum ElementType {
  TEXT = 'TEXT',
  MULTILINE_TEXT = 'MULTILINE_TEXT',
  BARCODE = 'BARCODE',
  QRCODE = 'QRCODE',
  IMAGE = 'IMAGE',
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  LINE = 'LINE',
  TABLE = 'TABLE',
  DYNAMIC_FIELD = 'DYNAMIC_FIELD',
}

export enum BarcodeType {
  CODE128 = 'CODE128',
  EAN13 = 'EAN13',
  PDF417 = 'PDF417',
}

export enum PaperType {
  A4 = 'A4',
  A5 = 'A5',
  A6 = 'A6',
  A7 = 'A7',
  LABEL_100x148 = 'LABEL_100x148',
  LABEL_100x100 = 'LABEL_100x100',
  CUSTOM = 'CUSTOM',
}

export enum Orientation {
  PORTRAIT = 'PORTRAIT',
  LANDSCAPE = 'LANDSCAPE',
}

export enum GridMode {
  NONE = 'NONE',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum LayerType {
  FOREGROUND = 'FOREGROUND',
  BACKGROUND = 'BACKGROUND',
}

export enum PaperUnit {
  MM = 'MM',
  CM = 'CM',
  PX = 'PX',
  INCH = 'INCH',
}

export enum DesignerMode {
  DESIGN = 'DESIGN',
  PREVIEW = 'PREVIEW',
}

export enum TemplateStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum TextAlign {
  LEFT = 'LEFT',
  CENTER = 'CENTER',
  RIGHT = 'RIGHT',
  JUSTIFY = 'JUSTIFY',
}

export enum VerticalAlign {
  TOP = 'TOP',
  MIDDLE = 'MIDDLE',
  BOTTOM = 'BOTTOM',
}

export enum FontWeight {
  NORMAL = 'NORMAL',
  MEDIUM = 'MEDIUM',
  SEMIBOLD = 'SEMIBOLD',
  BOLD = 'BOLD',
}

export enum ImageFitMode {
  CONTAIN = 'CONTAIN',
  COVER = 'COVER',
  FILL = 'FILL',
  NONE = 'NONE',
}

export enum ExportFormat {
  JSON = 'JSON',
  PNG = 'PNG',
  PDF = 'PDF',
  PRINT = 'PRINT',
}

export enum AuditAction {
  CREATE = 'template.create',
  UPDATE = 'template.update',
  DELETE = 'template.delete',
  CLONE = 'template.clone',
  ARCHIVE = 'template.archive',
  RESTORE = 'template.restore',
  VERSION_CREATE = 'version.create',
  VERSION_ROLLBACK = 'version.rollback',
}

export enum HistoryActionType {
  ADD_ELEMENT = 'ADD_ELEMENT',
  REMOVE_ELEMENT = 'REMOVE_ELEMENT',
  UPDATE_ELEMENT = 'UPDATE_ELEMENT',
  REORDER_LAYERS = 'REORDER_LAYERS',
  UPDATE_PAPER = 'UPDATE_PAPER',
  BATCH_UPDATE = 'BATCH_UPDATE',
  IMPORT_DOCUMENT = 'IMPORT_DOCUMENT',
}

export enum TemplateVariableKey {
  TRACKING_NO = 'trackingNo',
  SENDER_NAME = 'senderName',
  SENDER_PHONE = 'senderPhone',
  SENDER_ADDRESS = 'senderAddress',
  RECEIVER_NAME = 'receiverName',
  RECEIVER_PHONE = 'receiverPhone',
  RECEIVER_ADDRESS = 'receiverAddress',
  COD = 'cod',
  FEE = 'fee',
  WEIGHT = 'weight',
  CONTENT = 'content',
  CREATED_DATE = 'createdDate',
  BRANCH_CODE = 'branchCode',
  ROUTE_CODE = 'routeCode',
  WAREHOUSE_CODE = 'warehouseCode',
}
