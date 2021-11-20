module.exports = mongoose => {
    var schema = mongoose.Schema({
        block: String,
        hostalNo: String,
        studentId: String,
        roomCost: String,
        status: String,
        fromDate: Date,
        toDate: Date
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const hostal = mongoose.model("hostal", schema);
    return hostal;
};