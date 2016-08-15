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
    })
    .controller("ListController", (contacts, $scope)=>{
        $scope.contacts = contacts.data;
    });