"use strict";

var Errors = require("../errors/Errors");
var noop = require("../util/noop");
var Environment = require("../environment/Environment");

var CloseableView = {

    onClose: noop,

    close: function() {
        triggerOnCloseAndUnbindEventsOn(this);
        this.remove();
    },

    closeAsChild: function() {
        triggerOnCloseAndUnbindEventsOn(this);

        if (Environment.isServer()) {
            this.remove();
        }

        if (Environment.isClient()) {
            this.stopListening();
            this.$el.off();
            this.$el.removeData();
        }
    }

};

function triggerOnCloseAndUnbindEventsOn(view) {
    view.trigger("close");

    try {
        view.onClose();

        if (typeof view.hasChildViews === "function" && view.hasChildViews()) {
            view.closeChildViews();
        }
    } catch (e) {
        console.error(
            "Error: There is an error in an onClose callback.\n" +
            "View with broken onClose is: " + view
        );

        Errors.notify(e);
    }

    view.unbind();
}

module.exports = CloseableView;

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
