import { FragmentError, FragmentSuccess } from "../types/fragmentTypes";

export function isFragmentError<T>(result: FragmentSuccess<T> | FragmentError): result is FragmentError {
    return (result as FragmentError).code !== undefined;
}