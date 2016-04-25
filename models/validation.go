package models

type ValidationError interface {
	Field() string
	Error() string
}

type ValidationErrors []ValidationError

func (ve ValidationErrors) ToMap() map[string]string {
	errs := make(map[string]string, len(ve))
	for _, e := range ve {
		errs[e.Field()] = e.Error()
	}
	return errs
}

type UsernameValidationError struct{}

func (e UsernameValidationError) Field() string {
	return "Username"
}

func (e UsernameValidationError) Error() string {
	return "Username can only have letters, numbers, dashes and underscores. Ex: my_username123"
}

type UserTypeValidationError struct{}

func (e UserTypeValidationError) Field() string {
	return "Type"
}

func (e UserTypeValidationError) Error() string {
	return "Invalid user type"
}

type UserTypeStatusValidationError struct{}

func (e UserTypeStatusValidationError) Field() string {
	return "Status"
}

func (e UserTypeStatusValidationError) Error() string {
	return "Invalid status for this user type"
}

type UserStatusValidationError struct{}

func (e UserStatusValidationError) Field() string {
	return "Status"
}

func (e UserStatusValidationError) Error() string {
	return "Invalid user status"
}

type UserTypeDurationValidationError struct{}

func (e UserTypeDurationValidationError) Field() string {
	return "Duration"
}

func (e UserTypeDurationValidationError) Error() string {
	return "Invalid housing duration for this user type"
}

type UserDurationValidationError struct{}

func (e UserDurationValidationError) Field() string {
	return "Duration"
}

func (e UserDurationValidationError) Error() string {
	return "Invalid housing duration"
}

type UserPasswordValidationError struct{}

func (e UserPasswordValidationError) Field() string {
	return "Password"
}

func (e UserPasswordValidationError) Error() string {
	return "Password and password confirmation don't match"
}

type UserTypePostalCodeValidationError struct{}

func (e UserTypePostalCodeValidationError) Field() string {
	return "Postal Code"
}

func (e UserTypePostalCodeValidationError) Error() string {
	return "Postal Code must not be blank for this user type."
}

type UserTypeCapacityValidationError struct{}

func (e UserTypeCapacityValidationError) Field() string {
	return "Capacity"
}

func (e UserTypeCapacityValidationError) Error() string {
	return "You must select at least one person to house"
}
