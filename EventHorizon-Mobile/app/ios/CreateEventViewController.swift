import UIKit

class CreateEventViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    func setupUI() {
        view.backgroundColor = .white

        let eventNameLabel = UILabel()
        eventNameLabel.text = "Event Name:"

        let eventNameTextField = UITextField()
        eventNameTextField.placeholder = "Enter event name"

        let eventDateTimeLabel = UILabel()
        eventDateTimeLabel.text = "Event Date & Time:"

        let eventDateTimePicker = UIDatePicker()
        eventDateTimePicker.datePickerMode = .dateAndTime

        let eventDescriptionLabel = UILabel()
        eventDescriptionLabel.text = "Event Description:"

        let eventDescriptionTextView = UITextView()
        eventDescriptionTextView.text = "Enter event description"

        let createEventButton = UIButton()
        createEventButton.setTitle("Create Event", for: .normal)
        createEventButton.addTarget(self, action: #selector(createEvent), for: .touchUpInside)
    }

    @objc func createEvent() {
        // Collect data from UI components and create an event
        let eventName = "" // Get from UI
        let eventDateTime = Date() // Get from UI
        let eventDescription = "" // Get from UI

        EventDataManager.shared.createEvent(name: eventName, dateTime: eventDateTime, description: eventDescription)
        navigationController?.popViewController(animated: true)
    }
}
