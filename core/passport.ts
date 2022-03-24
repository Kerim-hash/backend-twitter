import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt'
import { UserModel, UserModelInterface } from '../models/UserModel';
import { generateMD5 } from '../utils/generateHash';

passport.use(
    new LocalStrategy(async (username, password, done): Promise<void> => {
        try {
            const user = await UserModel.findOne({ $or: [{ email: username }, { username }] }).exec()

            if (!user) {
                return done(null, false)
            }
            if (user.password === generateMD5(password + process.env.SECKRET_KEY)) {
                done(null, user)
            } else {
                done(null, false)
            }
        } catch (err) {
            done(err, false)
        }
    })
);


passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.SECKRET_KEY || '8D@UID@2d22erf',
            jwtFromRequest: ExtractJwt.fromHeader('token')
        },
        async (payload: {data: UserModelInterface}, done) => {
            try {
                const user = await UserModel.findById(payload.data._id).exec()
                if(user){
                  return done(null, user);
                }
                 done(null, false);
            } catch (error) {
                done(error, false );
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user?._id);
});


passport.deserializeUser((id: UserModelInterface, done: any) => {
    UserModel.findById(id, (err: any, user: UserModelInterface) => {
        done(err, user)
    })
});

export { passport }