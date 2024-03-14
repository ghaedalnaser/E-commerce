export interface ApiResponse<T>{
    data:T,
    message: string,
    cosd:number,
    error?:string
}
