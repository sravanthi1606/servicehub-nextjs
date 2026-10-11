package dto

type CreateBookingRequest struct {
	ServiceID      string  `json:"serviceId"`
	BookingDate    string  `json:"bookingDate"`
	BookingTime    string  `json:"bookingTime"`
	Country        string  `json:"country"`
	State          string  `json:"state"`
	District       string  `json:"district"`
	City           string  `json:"city"`
	Pincode        string  `json:"pincode"`
	Area           string  `json:"area"`
	BuildingNumber string  `json:"buildingNumber"`
	BuildingName   string  `json:"buildingName"`
	FlatNumber     string  `json:"flatNumber"`
	Block          string  `json:"block"`
	Street         string  `json:"street"`
	Landmark       string  `json:"landmark"`
	Latitude       float64 `json:"latitude"`
	Longitude      float64 `json:"longitude"`
	Notes          string  `json:"notes"`
}
