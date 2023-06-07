import { Collection } from "mongodb";

export interface DBCollectionsResponse {
	error: boolean;
	collections?: Collection[];
}

export interface Log {
	id: string;
	mac: string;
	startDate: string;
	endDate: string;
}
