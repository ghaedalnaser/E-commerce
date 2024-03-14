import * as jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';
import { settings } from '../../settings/setting';
const secret = settings.jwtSecret;
const tokenLifeSapn = settings.jwtTokenLifeTime;


export const generateAuthToken = ( payload: any ) => {
	return jwt.sign( payload, secret, {
		expiresIn: `${ tokenLifeSapn }d`,
		algorithm: 'HS256',
	} );
}

export const verifyAuthToken = ( idToken: string ) => {
	try {
		return <User> jwt.verify( idToken, secret );
	} catch ( err ) {
		console.error( err );
		return null;
	}
}

