
function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id ) {
            return i;
        }
    }

    return -1;
}


var messageApi = Vue.resource('/message{/id}');

Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function() {
        return {
            tag:'',
            text: '',
            id: ''

        }
    },
    watch: {
        messageAttr: function(newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
            this.tag=newVal.tag;
        }
    },
    template:
        ''+
        '<div style="display: flex;justify-content: space-between;width: 68%;">' +
        '<input type="text"  class="form-control"style="width:200px;height: 30px;" placeholder="Write note" v-model="text" />' +
        '<input   class="ml-5 form-control"type="text"  style="width:200px;height: 30px" placeholder="Write tag" v-model="tag" />' +
        '<input  class="ml-3 btn btn-success" style="height: 2rem;" type="button" value="Save" @click="save" />' +
        '</div>',
    methods: {
        save: function() {
            var message = { text: this.text,
                tag:this.tag};


            if (this.id) {
                messageApi.update({id: this.id}, message).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.messages, data.id);
                        this.messages.splice(index, 1, data);
                        this.text = '';
                        this.id = '';
                        this.tag = '';
                    })
                )
            } else {
                messageApi.save({}, message).then(result =>
                    result.json().then(data => {
                        this.messages.push(data);
                        this.text = '';
                        this.tag = ''

                    })
                )
            }
        }
    }
});

Vue.component('message-row', {
    props: ['message','tag', 'editMethod', 'messages'],
    template:
        '<div>'+
        '<div class=" mt-4 text-dark card"style="width: 34rem;height: 7.9rem;align-items: center;background-color: #F5F5DC;">' +
        '<i><span>&nbsp&nbsp</span></i> {{ message.text }}<b><span>&nbsp&nbsp</span>{{ message.tag }}</b> ' +
        '<span style="display: grid;position: absolute; right: 0;">' +
        '<input type="button" class="btn   btn-warning" style="margin-left: 76%;%;height: 2rem;width: 3rem;" value="Edit" @click="edit" />' +
        '<input class=" btn btn-danger" type="button" style="margin-top: 0.8rem;margin-left: 76%;height: 2rem;width: 3rem;" value="X" @click="del" />' +
        '<div><b>Share link:</b> <a class= "mt-3 btn btn-info" style="height: 1.8rem;"  v-bind:href="`/message/`+message.id">localhost:8080/message/{{message.id}}</a></div>'+
        '</span>' +
        '</div>'+

        '</div>',
    methods: {
        edit: function() {
            this.editMethod(this.message);
        },
        del: function() {
            messageApi.remove({id: this.message.id}).then(result => {
                if (result.ok) {
                    this.messages.splice(this.messages.indexOf(this.message), 1)
                }
            })
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function() {
        return {
            message: null,
            tag : null
        }
    },
    template:

        '<div style="position: relative; width: 800px;">' +
        '<message-form :messages="messages" :messageAttr="message"  />' +
        '<message-row v-for="message in messages" :key="message.id" :message="message"  :tag="tag"' +
        ':editMethod="editMethod" :messages="messages" />' +
        '</div>',
    methods: {
        editMethod: function(message,tag) {
            this.message = message;


        }
    }
});

var app = new Vue({
    el: '#app',
    template:
        '<div>' +
        '<div v-if="!profile"><h5>Hello, guest!<br /><br /><br />Log in via <a  class="btn btn-primary" href="/login">Google</a></h5> </div>' +
        '<div v-else >' +
        '<div class="row"><div class="alert alert-primary col-md-3 col-md-offset-2" role="alert">{{profile.name}}&nbsp;</div></div>' +
        '<a class="btn btn-danger" href="/logout">Log out </a>' +
        '<div>“Yesterday is gone. Tomorrow has not yet come. We have only today. Let us begin.”<br />' +
        '― Mother Theresa</div><br />'+
        '<messages-list :messages="messages" /><br />' +
        '</div>' +
        '</div>',
    data: {
        messages: frontendData.messages,
        profile: frontendData.profile
    },
    created: function() {
//    messageApi.get().then(result =>
//        result.json().then(data =>
//            data.forEach(message => this.messages.push(message))
//        )
//    )
    },
});