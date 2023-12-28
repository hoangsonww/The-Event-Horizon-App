import UIKit

class EventListViewController: UITableViewController {
    var events: [Event] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "Events"
        loadEvents()
    }

    func loadEvents() {
        var events: [Event] = []
        events = database.events
        return events
    }

    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return events.count
    }

    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "EventCell", for: indexPath)
        let event = events[indexPath.row]
        cell.textLabel?.text = event.name
        cell.detailTextLabel?.text = DateFormatter.localizedString(from: event.dateTime, dateStyle: .medium, timeStyle: .short)
        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let event = events[indexPath.row]
        let detailVC = EventDetailViewController()
        detailVC.event = event
        navigationController?.pushViewController(detailVC, animated: true)
    }
}
