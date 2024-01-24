export interface Todo {
    _id: string;
    creator_id: string;
    isComplete: boolean;
    summary: string;
}

export interface GraphqlResponse {
    data: {
        items: Todo[];
    };
}