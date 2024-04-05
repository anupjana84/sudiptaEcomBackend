
// // class ApiError extends Error {
// //     constructor(
// //         statusCode,
// //         message= "Something went wrong",
// //         errors = [],
// //         stack = ""
// //     ){
// //         super(message)
// //         this.statusCode = statusCode
// //         this.data = null
// //         this.message = message
// //         this.success = false;
// //         this.errors = errors

// //         // if (stack) {
// //         //     this.stack = stack
// //         // } else{
// //         //     Error.captureStackTrace(this, this.constructor)
// //         // }

// //     }
// // }

// function ApiError( status = 500,msg = 'Something Went Wrong',) {
// 	const e = new Error(msg);
// 	e.status = status;
// 	return e;
// }

// export {ApiError}



class ApiError extends Error {
    constructor(
        status,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.status = status
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export {ApiError}