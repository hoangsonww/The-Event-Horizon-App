import Foundation

class EventDetailViewModel {
    var event: Event

    init(event: Event) {
        self.event = event
    }

    func getFormattedDate() -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: event.dateTime)
    }
}
