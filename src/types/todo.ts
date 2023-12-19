export interface Todo {
    _id: string;
    owner_id: string;
    isComplete: boolean;
    summary: string;
}

export interface GraphqlResponse {
    data: {
        items: Todo[];
    };
}