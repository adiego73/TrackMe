import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService } from '../_services';
import { BloodType } from '../_models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    iForm: FormGroup;
    tpForm: FormGroup;
    iFormSubmitted = false;
    tpFormSubmitted = false;
    error = '';
    bloodTypes = BloodType.values();

    constructor(
        private iFormBuilder: FormBuilder,
        private tpFormBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
    ) {}

    ngOnInit() {
        this.iForm = this.iFormBuilder.group({
            name: ['', Validators.required],
            gender: ['', Validators.required],
            birthDate: ['', Validators.required],
            ssn: ['', Validators.required],
            weight: ['', Validators.required],
            height: ['', Validators.required],
            bloodType: ['', Validators.required],
            address: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });

        this.tpForm = this.tpFormBuilder.group({
            companyname: ['', Validators.required],
            taxcode: ['', Validators.required],
            phone: ['', Validators.required],
            certificate: ['', Validators.required],
            emailtp: ['', [Validators.required, Validators.email]],
            passwordtp: ['', [Validators.required, Validators.minLength(6)]],

            // TPConfiguration
            individualpushurl: [''],
            bulkpushurl: [''],
            notificationurl: ['']
        });
    }

    // convenience getter for easy access to form fields
    get iControls() { return this.iForm.controls; }
    get tpControls() { return this.tpForm.controls; }

    onSubmitIndividuals() {
        this.iFormSubmitted = true;

        // stop here if form is invalid
        if (this.iForm.invalid) {
            return;
        }

        const address = this.iControls.address.value.split(',');

        const individual = {
            'name':  this.iControls.name.value,
            'ssn': this.iControls.ssn.value,
            'weight': this.iControls.weight.value,
            'height': this.iControls.height.value,
            'birthDate': this.iControls.birthDate.value,
            'gender': this.iControls.gender.value,
            'address': {
                'city': address[0],
                'province': address[1],
                'country': address[2]
            },
            'bloodType': this.iControls.bloodType.value,
            'email': this.iControls.email.value,
            'password': this.iControls.password.value
        };

        if (this.iForm.valid) {
            this.authenticationService
                .signupIndividual(individual)
                .subscribe(
                    data => {
                        const user = {
                          'userId': data['userId'],
                          'accessToken': data['accessToken'],
                          'role': 'INDIVIDUAL'
                        };

                        this.authenticationService.setCurrentUser(user);

                    },
                    error => {
                        this.error = error;
                        console.log('error ', this.error);
                    }
                );
        }
    }

    onSubmitThirdParties() {
        this.tpFormSubmitted = true;

        // stop here if form is invalid
        if (this.tpForm.invalid) {
            return;
        }

        const thirdparty = {
            'name':  this.tpControls.companyname.value,
            'taxCode': this.tpControls.taxcode.value,
            'certificate': '',
            'phone': this.tpControls.phone.value,
            'email': this.tpControls.emailtp.value,
            'password': this.tpControls.passwordtp.value,
            'config': {
                'individualpushurl': this.tpControls.individualpushurl.value,
                'bulkpushurl': this.tpControls.bulkpushurl.value,
                'notificationurl': this.tpControls.notificationurl.value
            }
        };

        if (this.tpForm.valid) {
            this.authenticationService
                .signupThirdParty(thirdparty)
                .subscribe(
                    data => {
                        const user = {
                            'userId': data['userId'],
                            'accessToken': data['accessToken'],
                            'role': 'THIRD_PARTY'
                        };

                        this.authenticationService.setCurrentUser(user);
                    },
                    error => {
                        this.error = error;
                        console.log('error ', this.error);
                    }
                );
        }
    }

}
