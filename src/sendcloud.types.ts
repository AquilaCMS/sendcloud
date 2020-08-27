export interface StringMap {
    [key: string]: string
}

export enum customs_shipment_type {
    Gift = 0,
    Documents = 1,
    CommercialGoods = 2,
    CommercialSmaple = 3,
    ReturnedGoods = 4,
}

export enum DocumentType {
    /**
     * To be placed on the actual parcel.
     */
    label = 'label',
    /**
     * CP71 Dispatch Note for international shipments.
     */
    cp71 = 'cp71',
    /**
     * CN23 customs document for international shipments.
     */
    cn23 = 'cn23',
    /**
     * Sendcloud or carrier generated commercial invoice for internation shipments.
     */
    commercialInvoice = 'commercial-invoice',
    /**
     * The Sendcloud generated CN23 document.
     * If a CN23 document is returned, this document can is here for reference purposes.
     */
    cn23Default = 'cn23-default',
}

export enum FileFormat {
    pdf = 'pdf',
    zpl = 'zpl',
    png = 'png',
}

export interface SendCloudOption {
    api_key: string // 7182751373324de48da2dbe94bfd5e8d
    api_secret: string // 5cb453925cb74659b0fb1c50d2aa5292
    sendcloudPlus?: boolean
}

export interface ParcelQueryParameters {
    /**
     * Shows all parcels with requested status.
     */
    parcel_status?: number
    /**
     * Returns parcels that contain the tracking number which you have specified.
     */
    tracking_number?: string
    /**
     * Returns a certain order with an exactly defined order_number property from your parcels.
     */
    order_number?: string
    /**
     * Returns all orders which have been updated in our system after you given time.\
     * You can use the value of ISO 8601 DateTime string like this
     *  - `2018-02-26T11:01:47.505309+00:00`
     *  - `2018-02-26T11:01:47`
     *  - `2018-02-26`
     */
    updated_after?: string
    /**
     * Filter results using a list of Parcel IDs.\
     * This is a comma separated list of IDs, it may not contain more then 100 IDs.
     */
    ids?: string
    /**
     * Next and previous token that is used to paginate.\
     * The token is included in the response.
     */
    cursor?: string
}

export interface Parcel {
    /**
     * Name of the recipient
     */
    name: string
    /**
     * Company name of the recipient the parcel will be shipped to
     */
    company_name?: string
    /**
     * Address of the recipient
     */
    address: string
    /**
     * Additional address information, e.g. 2nd level
     */
    address_2?: string
    /**
     * House number of the recipient
     * required based on country
     */
    house_number?: string
    /**
     * City of the recipient
     */
    city: string
    /**
     * Zip code of the recipient
     */
    postal_code: string
    /**
     * Code required in case of PO Box or post locker delivery
     */
    to_post_number?: string
    /**
     * Country of the recipient
     */
    country: string
    /**
     * Code of the state (e.g. NY for New York) - (https://en.wikipedia.org/wiki/ISO_3166-2#Subdivisions_included_in_ISO_3166-1)
     * required when shipping outside of EU
     */
    country_state?: string
    /**
     * Phone number of the recipient
     */
    telephone?: number
    /**
     * E-mail address of the recipient
     */
    email?: string
    /**
     * ID of the SenderAddress
     */
    sender_address?: number
    /**
     * Customs invoice number
     * required when shipping outside of EU
     */
    customs_invoice_nr?: string
    /**
     * Customs shipment type. Accepts one of the following IDs:
     * - 0 - Gift
     * - 1 - Documents
     * - 2 - Commercial Goods
     * - 3 - Commercial Sample
     * - 4 - Returned Goods
     * required when shipping outside of EU
     */
    customs_shipment_type?: customs_shipment_type
    /**
     * Can be used to uniquely identify a Parcel using your own external reference.
     * This field is used to create idempotence.
     */
    external_reference?: string
}

export interface Documents {
    /**
     * The type of the document. See the list below for available types.
     */
    type: DocumentType
    /**
     * The paper size of the document, you can expect: a4 and a6.
     */
    size: string
    /**
     * A link to the document, which allows downloading of the document in PDF, PNG and ZPL and various DPI.
     */
    link: string
}

export interface ShippingService {
    /**
     * ID of the selected service point
     */
    to_service_point?: number
    /**
     * This field is mutually exclusive with total_insured_value.\
     * Amount of Sendcloud Insurance to add.\
     * Must be a multiple of 100 and maxes out at 2500 or 5000 depending on the carrier.\
     * This field does not take the carrier/shipping method insurance into consideration.
     */
    insured_value?: number
    /**
     * his field is mutually exclusive with insured_value.\
     * Amount of total insurance to add.\
     * Must be a multiple of 100 and maxes out at 2500 or 5000 plus your shipping method’s insurance depending on the carrier.\
     * This field works by automatically calculating how much Sendcloud Insurance you’d need to add plus your shipping method’s
     * insurance so it matches the exact value you’ve given. As an example, DPD insures all their shipments by 520€ by default.\
     * If you pass ‘total_insured_value’: 5000 your shipment will have a total insurance coverage of 5000€, but you’re only paying for 4480€.
     */
    total_insured_value?: number
}

export interface ParcelProperties {
    /**
     * Order number of your order
     */
    order_number?: string
    /**
     * Unique identifier that we assign to your shipment within the Sendcloud system.
     */
    shipment_uuid?: string
    /**
     * List of items the order contains.\
     * Check the structure of a parcel_item in the “Parcel_items” section (remember, it’s a list of them!).
     * required when shipping outside of EU
     */
    parcel_items?: Array<ParcelItems>
    /**
     * Weight of the parcel in kilograms, if none given the default weight from settings is used.\
     * If you provide no weight in your request we’ll use the default weight set in your settings.
     */
    weight?: string
    /**
     * Set to true if this parcel is a return
     */
    is_return?: boolean
}

export interface Announcement {
    /**
     * Should the parcel request a label.
     */
    request_label?: boolean
    /**
     * Makes sure that the label is requested asynchronously.\
     * The parcel is returned, but without label. You will need to poll for status changes on the parcel.
     */
    request_label_async?: boolean
    /**
     * Shipping method object for a parcel
     * required if request_label=True
     */
    shipment?: AnnoucementShipment
    /**
     * When set to True configured shipping rules will be applied **before** creating the label and announcing the Parcel
     * only applied when request_label=True
     */
    apply_shipping_rules?: boolean
}

export interface AnnoucementShipment {
    /**
     * ID of shipping method
     */
    id: number
    /**
     * Name of shipping method
     */
    name?: string
}

export interface SenderAddressDetails {
    /**
     * Name of the sender
     */
    from_name?: string
    /**
     * Company name of the sender the parcel will be shipped from
     */
    from_company_name?: string
    /**
     * Address of the sender
     */
    from_address_1?: string
    /**
     * Additional address information of the sender
     */
    from_address_2?: string
    /**
     * House number of the sender
     */
    from_house_number?: string
    /**
     * City of the sender
     */
    from_city?: string
    /**
     * Zip code of the sender
     */
    from_postal_code?: string
    /**
     * Country of the sender
     */
    from_country?: string
    /**
     * Phone number of the sender
     */
    from_telephone?: string
    /**
     * E-mail address of the sender
     */
    from_email?: string
}

export interface ParcelItems {
    /**
     * Description of the item
     */
    description: string
    /**
     * Quantity of items shipped
     */
    quantity: number
    /**
     * Weight of a single item in kilograms
     */
    weight: string
    /**
     * Value of a single item
     */
    value: number | string
    /**
     * Harmonized System Code (https://en.wikipedia.org/wiki/Harmonized_System)
     * required when shipping outside of EU
     */
    hs_code?: string
    /**
     * ISO-2 code of the country where the items were originally produced. (http://www.nationsonline.org/oneworld/country_code_list.htm)
     * required when shipping outside of EU
     */
    origin_country?: string
    /**
     * The SKU of the product
     */
    sku?: string
    /**
     * The internal ID of the product
     */
    product_id?: string
    /**
     * The list of properties of the product. Used as a JSON object with {‘key’: ‘value’}
     */
    properties?: StringMap
}

export interface ShippingMethodsQueryParameters {
    /**
     * An ID of your preferred sender address where you plan to ship your parcels from.
     * If you want to retrieve all available shipping methods, please use all as a value for this parameter.
     */
    sender_address?: number | string
    /**
     * Returns shipping methods available for that specific service point together with the carriers that use it
     */
    service_point_id?: number
    /**
     * If set to `true` the endpoint will return shipping methods specific for making a return
     */
    is_return?: boolean
}

export interface Country {
    iso_2: string
    iso_3: string
    id: number
    price: number
    name: string
}

export interface ShippingMethod {
    service_point_input: string
    max_weight: string
    name: string
    carrier: string
    countries: Array<Country>
    min_weight: string
    id: number
    price: number
}

export interface IntegrationShipmentQueryParameters {
    /**
     * Filters results to shipments where their external_order_id matches one of the given ones.
     */
    external_order_ids?: string
    /**
     * Filters results to shipments where their external_shipments_id matches one of the given ones.
     */
    external_shipment_ids?: string
    /**
     * Filters results to shipments on order_number.
     */
    order_number?: string
    /**
     * Displays orders from the given start_date. Defaults to two years ago.
     * format: YYYY-MM-DD
     */
    start_date?: string
    /**
     * Displays orders up to the given end_date. Defaults to the current date.
     * format: YYYY-MM-DD
     */
    end_date?: string
    /**
     * Allows to specify a sender address id in order to display proper allowed_shipping_methods
     */
    sender_address?: number
}

export interface IntegrationShipment {
    address: string
    address_2: string
    city: string
    company_name: string
    country: string
    created_at: string
    currency: string | null
    customs_invoice_nr: string
    customs_shipment_type: string | null
    email: string
    external_order_id: string
    external_shipment_id: string | null
    house_number: string
    name: string
    order_number: string
    order_status: Record<string, string> | null
    parcel_items: Array<ParcelItems> | null
    payment_status: Record<string, string> | null
    postal_code: string
    sender_address?: number
    shipping_method: number | null
    shipping_method_checkout_name: string
    telephone: string
    to_post_number: string
    to_service_point: string | null
    to_state: string | null
    updated_at: string
    weight: string
    shipments?: Array<ShippingMethod>
}
