const app = {
    largestSwap: (value) => {
        var starting_value = parseInt(value);
        var string_value = value.toString();
        var swaped_value = parseInt(string_value.split("").reverse().join(""));
        if (starting_value > swaped_value) {
            return true;
        } else {
            return false;
        }
    }
}
console.log(app.largestSwap(135));