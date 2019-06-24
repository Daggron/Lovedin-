class EnterPage {
    constructor(name){
        this.name = name;
    }
    openForm(){
        var enterBut = document.querySelector('.enter');
        var closeBut = document.querySelector(".close");
        enterBut.addEventListener('click', function(e){
            e.preventDefault();
            var form = document.querySelector(".container_form");
            if(!(form.classList=="active_container")){
                form.classList.toggle("active_container");
                this.classList.toggle("active_enter");
            }
        });
        closeBut.addEventListener('click', function(e){
            e.preventDefault();
            var form = document.querySelector(".container_form");
            if(!(form.classList=="active_container")){
                form.classList.toggle("active_container");
                enterBut.classList.toggle("active_enter");
            }
        });
    }
    formValid(){
        //     errors message
        function _check(field) {
            var el = document.createElement("i");
            var fa = el.classList.add("fa");
            var icon = el.classList.add("fa-check");
            var animation = el.classList.add("animated");
            var anim_type = el.classList.add("fadeInDown");
            var parent = field.parentNode;
            if (!(parent.childNodes[3])){
                parent.appendChild(el);
            } else {
                parent.childNodes[3].remove();
                _check(field);
            }
        }
        function _error(field) {
            var el = document.createElement("i");
            var fa = el.classList.add("fa");
            var icon = el.classList.add("fa-exclamation");
            var animation = el.classList.add("animated");
            var anim_type = el.classList.add("fadeInUp");
            var parent = field.parentNode;
            if (!(parent.childNodes[3])){
                parent.appendChild(el);
            } else {
                parent.childNodes[3].remove();
                field.value="";
                _error(field);
            }
        }
        //     data validation
        function _userValid(){
            var username = document.querySelector(".username");
            if (username.value.match(/[a-z]/i)){
                _check(username);
            }
            else {
                _error(username);
                return false;
            }
        }
        function _passValid(){
            var password = document.querySelector(".password");
            if (password.value.match(/[A-Z,a-z,0-9]/) && password.value.length > 8){
                _check(password);
            }
            else {
                _error(password);
                return false;
            }
        }
        function _emailValid(){
            var email = document.querySelector(".email");
            if (email.value.match(/[a-z]+@+[a-z]+.+[a-z]/i)){
                _check(email);
            }
            else {
                _error(email);
                return false;
            }
        }
        // registration
        function _registration(){
            var menu = document.querySelector(".info");
            var li = menu.querySelectorAll("li");
            for (var i = 0 ; i< li.length; i++){
                li[i].addEventListener("click", function(){
                    var emailBox = document.querySelector(".emailBox");
                    if(!(li[1].classList.contains("active_link"))){
                        li[1].classList.add("active_link");
                        emailBox.classList.add("active_emailBox");
                        li[0].classList.remove("active_link");
                    } else {
                        li[1].classList.remove("active_link");
                        emailBox.classList.remove("active_emailBox");
                        li[0].classList.add("active_link");
                    }
                })
            }
        }
        _registration();

        var sendBut = document.querySelector('.sendBut');
        sendBut.addEventListener("click", function(e){
            e.preventDefault();
            _userValid();
            _passValid();
            _emailValid();
            if(_userValid()!=false && _passValid()!=false && _emailValid()!=false){

            } else {
                console.log("Please fix you mistake");
            }
        });
    }
}


var enterPage = new EnterPage();
enterPage.openForm();
enterPage.formValid();
