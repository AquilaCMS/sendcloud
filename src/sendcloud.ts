import Axios from 'axios'
import {
    SendCloudOption,
    ParcelQueryParameters,
    DocumentType,
    FileFormat,
    ShippingMethodsQueryParameters,
    IntegrationShipmentQueryParameters,
    IntegrationShipment,
} from './sendcloud.types'

const SENDCLOUD_API_URL = 'https://panel.sendcloud.sc/api/v2/'

const validateOptions = (options?: { format?: FileFormat; dpi?: number }): any => {
    options = options || { format: FileFormat.pdf }
    options.dpi = options.dpi || 0

    switch (options.format) {
        case 'pdf':
            if (options.dpi !== 72) {
                options.dpi = 72
            }
            break
        case 'zpl':
            if ([203, 300, 600].indexOf(options.dpi) < 0) {
                options.dpi = 203
            }
            break
        case 'png':
            if ([150, 300].indexOf(options.dpi) < 0) {
                options.dpi = 300
            }
            break
        default:
            options = {
                format: FileFormat.pdf,
                dpi: 72,
            }
    }
    return options
}

const generateQueryParams = (options?: any) => {
    let queryParams = ''
    if (options) {
        for (const [option, value] of Object.entries(options)) {
            queryParams += queryParams === '' ? '?' : '&'
            queryParams += `${option}=${value}`
        }
    }
    return queryParams
}

export default class SendCloud {
    private configuration: SendCloudOption

    constructor(options: SendCloudOption) {
        this.configuration = options
        Axios.defaults.baseURL = SENDCLOUD_API_URL
    }

    parcels = {
        /**
         * This endpoint retrieves all parcels which you have imported under your provided API credentials.\
         * You may filter parcels on the query parameters provided below.
         * @param options query params
         */
        getParcels: async (options?: ParcelQueryParameters): Promise<any> => {
            const queryParams = generateQueryParams(options)
            const { data: responseData } = await Axios.get(`parcels${queryParams}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * This endpoint retrieves a specific parcel from your account based on parcel id.
         * @param id parcel id
         */
        getParcel: async (id?: number): Promise<any> => {
            const { data: responseData } = await Axios.get(`parcels/${id}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        createParcel: async (data: Record<string, unknown>): Promise<any> => {
            const { data: responseData } = await Axios.post(`parcels`, data, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * This endpoint updates a parcel with the option to request a label - if it hasn’t been requested before.\
         * The post request parameters have to be nested under a parcel object.\
         * You can change any properties given in the Create parcel example under Post request parameters.
         * @param id
         */
        updateParcel: async (id: string): Promise<any> => {
            const { data: responseData } = await Axios.put(
                `parcels`,
                {
                    id,
                },
                {
                    auth: {
                        username: this.configuration.api_key,
                        password: this.configuration.api_secret,
                    },
                },
            )
            return responseData
        },
        cancelParcel: async (id: string): Promise<any> => {
            const { data: responseData } = await Axios.post(
                `parcels/${id}/cancel`,
                {},
                {
                    auth: {
                        username: this.configuration.api_key,
                        password: this.configuration.api_secret,
                    },
                },
            )
            return responseData
        },
        returnPortalUrl: async (id: string): Promise<any> => {
            const { data: responseData } = await Axios.get(`parcels/${id}/return_portal_url`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * Announced parcels contain a label and depending on the destination, carrier and used carrier service can also contain other documents.\
         * These documents can be downloaded separatly in different formats and DPI.
         * @param id parcel id
         * @param type document type
         * @param options document options
         */
        parcelDocument: async (
            id: string,
            type: DocumentType,
            options?: {
                format?: FileFormat
                dpi?: number
            },
        ): Promise<any> => {
            options = validateOptions(options)
            const queryParams = generateQueryParams(options)
            const { data: responseData } = await Axios.get(
                `parcels/${id}/documents/${type}${queryParams}`,
                {
                    auth: {
                        username: this.configuration.api_key,
                        password: this.configuration.api_secret,
                    },
                },
            )
            return responseData
        },
        parcelStatuses: async (): Promise<any> => {
            const { data: responseData } = await Axios.get(`parcels/statuses`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
    }

    returns = {
        /**
         * This endpoint retrieves all returns, both created through the return portal or the API.
         * Depending on whether a return parcel contains items or not, the refund, reason, and message
         * fields will be filled either in the return data, or the incoming parcel item dataresponseData
         */
        getReturns: async (): Promise<any> => {
            const { data: responseData } = await Axios.get(`returns`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * This endpoint retrieves a specific return from your account based on ID.
         * Depending on whether a return parcel contains items or not, the refund, reason,
         * and message fields will be filled either in the return data, or the incoming parcel item dataresponseData
         * @param id return id
         */
        getReturn: async (id: string): Promise<any> => {
            const { data: responseData } = await Axios.get(`returns/${id}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
    }

    brands = {
        /**
         * This endpoint retrieves all brands.
         */
        getBrands: async (): Promise<any> => {
            const { data: responseData } = await Axios.get(`brands`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * This endpoint retrieves a specific brand from your account based on id.
         */
        getBrand: async (id: string): Promise<any> => {
            const { data: responseData } = await Axios.get(`brand/${id}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
    }

    shipping = {
        /**
         * This endpoint will return the shipping methods that are associated with your default sender address.
         */
        getShippingMethods: async (options?: ShippingMethodsQueryParameters): Promise<any> => {
            options = options || {}
            const queryParams = generateQueryParams(options)
            const { data: responseData } = await Axios.get(`shipping_methods${queryParams}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * This endpoint will return the shipping methods that are associated with your default sender address.
         */
        getShippingMethod: async (
            id: string,
            options?: ShippingMethodsQueryParameters,
        ): Promise<any> => {
            options = options || {}
            const queryParams = generateQueryParams(options)
            const { data: responseData } = await Axios.get(`shipping_methods/${id}${queryParams}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
    }

    labels = {
        /**
         * Get a PDF label
         * @param id Parcel id of which you want the label from
         */
        getLabels: async (id: string): Promise<any> => {
            const { data: responseData } = await Axios.get(`labels/${id}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * Bulk PDF label printing\
         * Using this endpoint you may print your parcel labels in bulk.
         * @param parcels Define the parcel id’s of the parcels you want to print the labels for.
         */
        labelsBulk: async (parcels: Array<number | string>): Promise<any> => {
            const { data: responseData } = await Axios.post(
                `labels`,
                {
                    label: { parcels },
                },
                {
                    auth: {
                        username: this.configuration.api_key,
                        password: this.configuration.api_secret,
                    },
                },
            )
            return responseData
        },
    }

    user = {
        /**
         * With this endpoint you can request the data that is connected with your own user.
         */
        getUser: async (): Promise<any> => {
            const { data: responseData } = await Axios.get(`user`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * With this enpoint you can get all the invoices that have been issued to your account.
         */
        invoices: async (): Promise<any> => {
            const { data: responseData } = await Axios.get(`user/invoices`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * With this enpoint you can get all the invoices that have been issued to your account.
         */
        invoice: async (id: string): Promise<any> => {
            const { data: responseData } = await Axios.get(`user/invoices/${id}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * With this endpoint you can retrieve all the sender addresses that you have created under your account.
         */
        senderAddresses: async (): Promise<any> => {
            const { data: responseData } = await Axios.get(`user/addresses/sender`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        /**
         * With this enpoint you can get a specific invoice that has been issued to your account.
         */
        senderAddress: async (id: string): Promise<any> => {
            const { data: responseData } = await Axios.get(`user/addresses/sender/${id}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
    }

    integrations = {
        getIntegrations: async (): Promise<any> => {
            const { data: responseData } = await Axios.get(`integrations`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
            })
            return responseData
        },
        updateIntegrations: async (id: string, data: Record<string, unknown>): Promise<any> => {
            const { data: responseData } = await Axios.put(`integrations/${id}`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
                json: data,
            })
            return responseData
        },
        /**
         * You’re able to retrieve the list of shipments from an integration
         * Do note that these shipments will NOT be affected by Shipping Rules on the time of retrieval.
         * @param id integrations id
         */
        integrationShipments: async (
            id: string,
            options?: IntegrationShipmentQueryParameters,
        ): Promise<any> => {
            options = options || {}
            const queryParams = generateQueryParams(options)
            const { data: responseData } = await Axios.get(
                `integrations/${id}/shipments${queryParams}`,
                {
                    auth: {
                        username: this.configuration.api_key,
                        password: this.configuration.api_secret,
                    },
                },
            )
            return responseData
        },
        /**
         * You can insert shipments into an API integration. This is a more refined and supported way of creating
         * shipments within our Panel which then can be used to generate Parcels easily.
         * This endpoint has a way more relaxed validation than our Parcel API endpoint and is recommended for third party integrators.\
         * This is an UPSERT endpoint. This means that this endpoint tries to be idempotent given specific fields,
         * updating our database values if there’s a match or creating a new entry if there is not.\
         * Our system will ensure uniqueness of shipments with the combination of external_order_id and external_shipment_id.\
         * The system will only update orders that have had their updated_at (ISO 8601 DateTime) timestamp changed.\
         * The field external_shipment_id is used to split orders across multiple shipments,
         * this feature is not supported in all shop systems.
         * However, if the shop has this feature and allows the distribution of the product items of an order across
         * different shipments you can use the shipment data instead of plain order, and create multiples entries for each shipment.
         * When the order is created and does not have any shipments yet, you can send external_shipment_id as null.\
         * If the shop does not multiple shipments per order, or you wish to only synchronize orders,
         * this feature you can sent the external_shipment_id with null value.\
         * Batches are limited to 100 orders at once.
         * @param id
         * @param data
         */
        createIntegrationShipments: async (
            id: string,
            data: Array<IntegrationShipment>,
        ): Promise<any> => {
            const { data: responseData } = await Axios.post(`integrations/${id}/shipments`, {
                auth: {
                    username: this.configuration.api_key,
                    password: this.configuration.api_secret,
                },
                json: data,
            })
            return responseData
        },
        /**
         * If orders are cancelled or deleted in a shop you must remove them from our database
         * (as the fields “order_status” and “payment_status” are not mapped to anything within our systems).
         * You must provide either a shipment_uuid or the combination of external_order_id and external_shipment_id to this endpoint.
         * @param id integrations id
         */
        deleteIntegrationShipments: async (
            id: string,
            data:
                | { shipment_uuid: string }
                | { external_order_id: string; external_shipment_id: string },
        ): Promise<any> => {
            const { data: responseData } = await Axios.post(
                `integrations/${id}/shipments/delete`,
                data,
                {
                    auth: {
                        username: this.configuration.api_key,
                        password: this.configuration.api_secret,
                    },
                },
            )
            return responseData
        },
    }
}
