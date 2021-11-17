module.exports = mongoose => {
    var schema = mongoose.Schema({
        title: String,
        description: String,
        author: String,
        status: String,
        issuedtoStudent: String
    }, { timestamps: true });

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const books = mongoose.model("books", schema);
    return books;
};