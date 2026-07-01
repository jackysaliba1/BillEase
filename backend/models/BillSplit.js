module.exports= (sequelize,DataTypes) =>{
    const BillSplit=sequelize.define("BillSplit",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
billId:{
    type: DataTypes.INTEGER,
    allowNull:false,
},
ownerId:{
    type:DataTypes.INTEGER,
    allowNull:false,
},
participantEmail:{
     type: DataTypes.STRING,
    allowNull:false,
},
shareAmount:{
     type: DataTypes.DOUBLE,
    allowNull:false,
},
isPaid:{
     type: DataTypes.BOOLEAN,
    allowNull:false,
},
    },{timestamps:true});
    BillSplit.associate=(db) =>{
        BillSplit.belongsTo(db.Bills,{foreignKey:"billId"});
        BillSplit.belongsTo(db.User,{foreignKey:"ownerId"});
    };
return BillSplit;
    };