import {extend} from 'vee-validate'
import {email, length, max, min, min_value, required,} from 'vee-validate/dist/rules'
import {amgApi} from "@/service/axios";
import generalMixin from '@/mixins/general'
import store from "@/store";

extend('secret', {
  validate: value => value === 'example',
  message: 'This is not the magic word',
})
extend('title-required', {
  validate(value) {
    return !!value.title;
  },
  message: 'Title is required',
})
extend('length', {
  ...length,
  message: 'is length',
})
extend('min_value', {
  ...min_value,
  message: 'is min',
})
extend('min', {
  ...min,
  message: 'is min',
})
extend('valid-document', {
  validate: value => (value.length == 11 || value.length == 0),
  message: 'Please enter a valid Document',
})
extend('max', {
  ...max,
  message: 'is max',
})
extend('required', {
  ...required,
  message: 'is required',
})
extend('email', {
  ...email,
  message: 'This field must be a valid email',
})
extend('chat-compose-required', {
    ...required,
    message: '{_field_} is required'
})
extend('mobile', {
  validate: value => value.length == 14,
  message: 'This field must be a valid mobile number',
})

extend('validate-amount', {
  validate: value => value > 0,
  message: 'The amount must be greater than 0.00',
})
extend('array', {
  validate: value => value.length > 0,
  message: 'This field is required',
})
extend('boolean', {
  validate: value => value == true,
  message: '',
})
extend('validate-hours-92', {
  validate: value => value >= 92,
  message: 'The minimum of hours is 92',
})
extend('money-1', {
  validate: value => value >= 1,
  message: 'Required',
})
extend('money-required', {
  validate: value => value > 0,
  message: 'Required',
})
extend('validate-spaces', {
  validate: value => value.replace(/\s/g, '') != '',
  message: 'The field is required',
})
extend('password', {
  params: ['confirm'],
  validate(value, { confirm }) {
    return value === confirm
  },
  message: 'Password confirmation does not match',
})
extend('specialpassword', {
  validate: value => {
    const regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regularExpression.test(value)
  },
  message: 'The Format must have a minimum. A capital letter, a lowercase, a number, a special character, and a minimum of 8 characters. Example: Abcd1234@',
})

extend('unique-nickname', {
  async validate(value) {
    //store.commit("app/SET_LOADING", true);
    const resp = await amgApi.post('/lead/social-network/validate-exists-nickname', {
      nickname: value, lead_id: null
    });
    //await store.commit("app/SET_LOADING", false);
    return !resp.data.code;
  },
  message: 'is not unique',
});

extend('unique-mobile', {
  async validate(value) {
    const resp = await amgApi.post('/lead/social-network/unique-mobile-sn', {
      mobile: value
    });
    return !resp.data.code;
  },
  message: 'is not unique',
});