export type IUserRoutesTableFilters = {
    name: string;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IUserRouteItem = {
    _id: string;
    taxes: number;
    status: string;
    shipping: number;
    discount: number;
    subTotal: number;
    orderNumber: string;
    totalAmount: number;
    totalQuantity: number;
    shippingAddress: IUserRouteShippingAddress[];
    items: IUserRouteProductItem[];
    createdAt: Date;
};

export type IUserRouteProductItem = {
    id: string;
    sku: string;
    name: string;
    price: number;
    coverUrl: string;
    quantity: number;
};

export type IUserRouteShippingAddress = {
    id: string;
    fullAddress: string;
    phoneNumber: string;
    longitude: string;
    latitude: string;
    road: string;
    products: IUserRouteProductItem[]
};

export type IMapBoxDirectionsResponse = IMapBoxDirectionsRoute[]
export type IMapBoxDirectionsRoute = {
    weight_name: string;
    weight: number;
    duration: number;
    distance: string;
    legs: IMapBoxDirectionLeg[];
    geometry: {
        coordinates: [number, number][]
    };
}


export type IMapBoxDirectionLeg = {
    via_waypoints: [];
    admins: Array<Record<string, string>>;
    weight: number;
    duration: number;
    steps: IMapBoxDirectionLegStep;
    distance: number;
    summary: string;
}
export type IMapBoxDirectionLegStep = {
    intersections: IMapBoxDirectionLegStepInterception[];
    name: string;
    duration: number;
    distance: number;
    driving_side: string;
    weight: number;
    mode: string;
    maneuver: IMapBoxDirectionLegStepManeuver;

}

export type IMapBoxDirectionLegStepInterception = {
    classes: string[];
    entry: string[];
    bearings: number[];
    duration: number;
    mapbox_streets_v8: Record<string, string>;
    is_urban: boolean;
    admin_index: number;
    out: number;
    weight: number;
    geometry_index: number;
    location: [number, number]
    geometry: IMapBoxDirectionLegStepGeometry;
}

export type IMapBoxDirectionLegStepManeuver = {
    type: string;
    instruction: string;
    bearing_after: number;
    bearing_before: number;
    location: [number, number]
}

export type IMapBoxDirectionLegStepGeometry = {
    coordinates: [number, number][];
    type: string;
}
