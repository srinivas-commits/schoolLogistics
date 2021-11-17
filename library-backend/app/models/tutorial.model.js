module.exports = mongoose => {
    var schema = mongoose.Schema({
        course: String,
        branch: [String],
        link: String,
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const tutorial = mongoose.model("tutorial", schema);
    return tutorial;
};