import Foundation

struct Event {
    var id: UUID
    var name: String
    var dateTime: Date
    var description: String

    init(name: String, dateTime: Date, description: String) {
        self.id = UUID()
        self.name = name
        self.dateTime = dateTime
        self.description = description
    }
}
