angular.module('contactsApp', ['ngRoute'])
    .config(function($routeProvider){
        $routeProvider
        .when("/", {
            templateUrl: "list.html",
            controller: "ListController",
            resolve: {
                contacts: function(Contacts){
                    return Contacts.getContacts();
                }
            }
        })
        .when('/new/contact', {
            controller: 'NewContactController',
            templateurl: 'contact-form.html'
        })
        .when('/contact/:contactId', {
            controller: 'EditContactController',
            templateUrl: 'contact.html'
        })
        .otherwise({
            redirectTo: '/'
        })
    })
    .service("Contacts", function($http){
        this.getContacts = function(){
            return $http.get("/contacts")
            .then((res)=>{
                return res;
            }, (res)=>{
                alert("Err retreiving contacts");
            });
        }
        this.createContact = function(contact){
            return $http.post('/contacts', contact)
            .then((res)=>{
                return response;
            }, (err)=>{
                alert('Error creating contact');
            });
        }
        this.getContact = function(contactId){
            var url = '/contacts/' + contactId;
            return $http.get(url)
                .then((res)=>{
                    return res;
                }, (err)=>{
                    alert("Error finding this contact.");
                });
        }
        this.editContact = function(contact){
            var url = '/contacts/' + contact._id;
            console.log(contact._id);
            return $http.put(url, contact)
                .then((res)=>{
                    return res;
                }, (err)=>{
                    alert("error editing this contact.");
                    console.log(err);
                });
        }
        this.deleteContact = function(contactId){
            var url = '/contacts/' + contactId;
            return $http.delete(url)
                .then((res)=>{
                    return res;
                }, (err)=>{
                    alert('Error deleting this contact.');
                    console.log(err);
                });
        }
    })
    .controller("ListController", (contacts, $scope)=>{
        $scope.contacts = contacts.data;
    })
    .controller('NewContactController', ($scope, $location, Contacts)=>{
        $scope.back = function(){
            $location.path('#/');
        }

        $scope.saveContact = function(contact){
            Contacts.createContact(contact).then((doc)=>{
                var contactUrl = '/contact/' + doc.data._id;
                $location.path(contactUrl);
            }, (err)=>{
                alert(err);
            });
        }
    })
    .controller('EditContactController', ($scope, $routeParams, Contacts)=>{
        Contacts.getContact($routeParams.contactId).then((doc)=>{
            $scope.contact = doc.data;
        }, (err)=>{
            alert(err);
        });

        $scope.toggleEdit = function(){
            $scope.editMode = true;
            $scope.contactFormUrl = 'contact-form.html';
        }

        $scope.back = function(){
            $scope.editMode = false;
            $scope.contactFormUrl = '';
        }

        $scope.saveContact = function(contact){
            Contacts.editContact(contact);
            $scope.editMode = false;
            $scope.contactFormUrl = '';
        }

        $scope.deleteContact = function(contactId){
            Contacts.deleteContact(contactId);
        }
    });