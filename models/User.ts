import mongoose , {Schema , Document , Model} from "mongoose";

export interface IUser extends Document{
  name : string;
  email : string;
  passwordHash : string ;
  role : 'user' | 'admin';
  isVerified :boolean ;
  verificationToken? : string;
  createdAt : Date;
  updatedAt : Date ;

}

const UserSchema = new Schema<IUser>(
  {
    name :{
      type : String ,
      required : [true ,'Please provide the Name'],
      trim : true
    },
    email :{
      type : String,
      required : [true , 'Please enter the email'],
      unique : true,
      lowercase : true ,
      trim : true,
    },
    passwordHash:{
      type : String ,
      required : [true , 'please enter the password'],
    },
    role : {
      type : String ,
      enum :['user' , 'admin'],
      default : 'user',
    },
    isVerified:{
      type : Boolean ,
      default : false ,
    },
    verificationToken:{
      type : String,
    },
  },
  {
  timestamps : true
  }
);

const User: Model<IUser> = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);   

export default User;