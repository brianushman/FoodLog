
var GetUrlDate = function() {
    var parts = document.location.href.split("/");
    var last_part = parts[parts.length - 1];
    return last_part.indexOf('?') == 0 ? moment(last_part.substring(1)) : moment();
}

function LogEntry() {
    var self = this;

    self.timestamp = ko.observable(moment().format("YYYY/MM/DD hh:mm a"));
    self.meal = ko.observable();
    self.description = ko.observable();
    self.hungerScale = ko.observable();
    self.location = ko.observable();
    self.comments = ko.observable();
    self.image = ko.observable();

    self.ImageSource = function () {
        return self.image() == undefined ? "/Images/NoImagePlaceholder.jpg" : "data:image/png;base64," + self.image();
    }

    self.ImageMarkup = function () {
        return self.image() == undefined ? undefined : "data:image/png;base64," + self.image();
    }

    self.ImagePreview = function () {
        if (self.image() == undefined) return;
        bootbox.dialog({
            title: "Entry Image Preview",
            message: $.validator.format('<div style="overflow: auto"><img src="{0}"></img></div>', self.ImageSource()),
            buttons: {
                main: {
                    label: "Close",
                    className: "btn-primary"
                }
            }
        });
        $(".modal-dialog").width($(window).width() - 50);
    }

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
            case 6:
                return "Awake";
            case 7:
                return "Asleep";
            default:
                return "N/A";
        }
    });

    self.Column1Text = ko.computed(function () {
        return $.validator.format("<strong>{0}</strong><br>TIME: <u>{1}</u>", self.DisplayMeal().toUpperCase(), moment(self.timestamp()).format("h:mm a"));
    });

    self.EliminationEntry = ko.computed(function () {
        return $.validator.format('TIME {0}<br>{1}', moment(self.timestamp()).format("h:mmA"), self.description());
    });
    
    self.Load = function (value) {
        self.timestamp(value.Timestamp);
        self.meal(value.Meal);
        self.description(value.Description);
        self.hungerScale(value.HungerScale);
        self.location(value.Location);
        self.comments(value.Comments);
        self.image(value.Image);
        return self;
    }
}

function HomePage() {
    var self = this;

    self.LogEntries = ko.observableArray([]);

    self.JournalHeading = ko.computed(function () {
        return $.validator.format("Journal Entry for {0}", GetUrlDate().format("dddd, MMM Do YYYY"));
    });

    self.EliminationEntries = ko.computed(function () {
        return $.grep(self.LogEntries(), function (value, i) {
            return value.meal() == 5;
        });
    });

    self.AwakeEntries = ko.computed(function () {
        return $.grep(self.LogEntries(), function (value, i) {
            return value.meal() == 6;
        });
    });

    self.EliminationBorderStyling = function (index) {
        return index == 0 ? "0px solid green" : "1px solid #dddddd";
    }

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
                                var newEntry = new LogEntry().Load(JSON.parse(data));
                                if (moment(newEntry.timestamp()).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
                                    self.LogEntries.push();
                                }
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
                    }
                },
                main: {
                    label: "Cancel",
                    className: "btn-primary"
                }
            }
        });
        $(messageTemplate).show();
        $(".modal-body").css("padding-bottom", 0);

        if (logEntry == undefined) {
            logEntry = new LogEntry();
        }

        ko.applyBindings(logEntry, document.getElementById("dialog-log-entry"));

        $('.fileupload').fileupload({
            dataType: 'json',
            url: '/Files/UploadFiles',
            autoUpload: true,
            maxFileSize: 5000000, // 5 MB
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator && navigator.userAgent),
            imageMaxWidth: 800,
            imageMaxHeight: 800,
            imageCrop: true,
            acceptFileTypes: '/^image\/(gif|jpeg|png)$/',
            previewSourceFileTypes: '/^image\/(gif|jpeg|png)$/',
            done: function (e, data) {
                logEntry.image(data._response.result.fileInfo.Data);
            }
        }).on('fileuploadprogressall', function (e, data) {
            //var progress = parseInt(data.loaded / data.total * 100, 10);
            //$('.progress .progress-bar').css('width', progress + '%');
        });
    }

    self.MoveNextDay = function () {
        var date = GetUrlDate().add(1, 'days');
        window.location.href = "?" + date.format("YYYY-MM-DD");
    }

    self.MovePreviousDay = function () {
        var date = GetUrlDate().subtract(1, 'days');
        window.location.href = "?" + date.format("YYYY-MM-DD");
    }

    self.MoveToday = function () {
        window.location.href = "/";
    }
        
    self.Load = function () {
        $.ajax({
            type: "GET",
            url: "api/LogEntries/" + GetUrlDate().format("YYYY-MM-DD"),
            //url: "api/LogEntries",
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

$('#btnChangeDate').datepicker()
.on('changeDate', function(ev){
    window.location.href = "?" + moment(ev.date).format("YYYY-MM-DD");
});