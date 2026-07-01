module.exports= (sequelize,DataTypes) =>{
    const User =sequelize.define("User", {
id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
},
name:{
    type:DataTypes.STRING,
    allowNull:false,    //name is required
},
email:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate: {
        isEmail:true,
    },
},
password:{
    type:DataTypes.STRING,
    allowNull:false,
},
    },
    {
    timestamps:true,
    });

User.associate= (db)=>{
   User.hasMany(db.Bills,{foreignKey:"userId"});
    User.hasMany(db.Reminder,{foreignKey:"userId"});
    User.hasOne(db.UserSettings,{foreignKey:"userId"});
};

    return User;
};