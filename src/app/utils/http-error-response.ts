import { HttpErrorResponse } from '@angular/common/http';

export class FlagsyHttpErrorResponse extends HttpErrorResponse {
	override error!: {
		message: string;
		stack: string[];
		statusCode: number;
		statusMessage: string;
		url: string;
	};
}
