import UIKit

class EventDetailViewController: UIViewController {
    var event: Event?

    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = event?.name
        setupUI()
    }

    func setupUI() {
        view.backgroundColor = .white

        let nameLabel = UILabel()
        nameLabel.text = "Event Name: \(event?.name ?? "N/A")"

        let dateTimeLabel = UILabel()
        if let date = event?.dateTime {
            dateTimeLabel.text = "Date & Time: \(DateFormatter.localizedString(from: date, dateStyle: .long, timeStyle: .short))"
        }

        let descriptionLabel = UILabel()
        descriptionLabel.text = "Description: \(event?.description ?? "N/A")"
    }
}
