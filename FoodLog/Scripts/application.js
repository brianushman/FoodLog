
function LogEntry() {
    var self = this;

    self.timestamp = ko.observable(moment().format("YYYY/MM/DD hh:mm a"));
    self.meal = ko.observable();
    self.description = ko.observable();
    self.scale = ko.observable();
    self.location = ko.observable();
    self.comments = ko.observable();
    self.image = ko.observable();

    self.DisplayMeal = ko.computed(function () {
        switch (self.meal()) {
            case 1:
                return "Breakfast";
            case 2:
                return "Lunch";
            case 3:
                return "Dinner";
            case 4:
                return "Snack";
            case 5:
                return "Elimination";
            default:
                return "N/A";
        }
    });

    self.Column1Text = ko.computed(function () {
        return "<strong>" + self.DisplayMeal().toUpperCase() + "</strong><br>TIME: <u>" + moment(self.timestamp()).format("h:mm a") + "</u>";
    });

    self.Load = function (value) {
        self.timestamp(value.Timestamp);
        self.meal(value.Meal);
        self.description(value.Description);
        self.scale(value.HungerScale);
        self.location(value.Location);
        self.comments(value.Comments);
        self.image(value.Image);
        return self;
    }
}

function HomePage() {
    var self = this;

    self.LogEntries = ko.observableArray([]);

    self.CreateEntry = function (logEntry) {
        var messageTemplate = $("#dialog-log-entry-template").html();
        bootbox.dialog({
            closeButton: false,
            title: "Log Entry",
            message: messageTemplate,
            buttons: {
                success: {
                    label: logEntry == undefined ? "Create" : "Save",
                    className: "btn-success",
                    callback: function () {
                        $.ajax({
                            type: "POST",
                            url: "api/LogEntries",
                            xhrFields: {
                                withCredentials: true
                            },
                            data: ko.mapping.toJSON(logEntry),
                            async: false,
                            contentType: "application/json; charset=utf-8",
                            success: function (data) {
                                self.LogEntries.push(new LogEntry().Load(JSON.parse(data)));                            },
                            error: function (error) {
                                /*$.notify({
                                    // options
                                    message: error.responseText,
                                }, {
                                    // settings
                                    type: 'danger'
                                });*/

                                return false;
                            }
                        });
                    }
                },
                main: {
                    label: "Cancel",
                    className: "btn-primary"
                }
            }
        });
        $(messageTemplate).show();

        if (logEntry == undefined) {
            logEntry = new LogEntry();
        }

        ko.applyBindings(logEntry, document.getElementById("dialog-log-entry"));
    }
        
    self.Load = function () {
        $.ajax({
            type: "GET",
            url: "api/LogEntries",
            xhrFields: {
                withCredentials: true
            },
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                var items = JSON.parse(data);
                items.forEach(function (item) {
                    self.LogEntries.push(new LogEntry().Load(item));
                });
            },
            error: function (error) {
                /*$.notify({
                    // options
                    message: error.responseText,
                }, {
                    // settings
                    type: 'danger'
                });*/

                return false;
            }
        });
        return self;
    }
}

ko.applyBindings(new HomePage().Load(), document.getElementById("body"));