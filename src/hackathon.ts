class Audience{
    private static nextId: number = 1;
    id: number;
    name: string;
    email: string;
    phone: string;
    constructor(name:string, email:string,phone:string) {
        this.id = Audience.nextId++;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
    getDetails() {
        console.log(`Mã:${this.id},Tên khán giả: ${this.name},Email:${this.email}, SĐT: ${this.phone}`);
        
    }
}
abstract class Movie{
    private static movieId: number = 1;
    id: number;
    title: string;
    genre: string;
    ticketPrice: number;
    isShowing: boolean;
    constructor(title:string,genre:string,ticketPrice:number) {
        this.id = Movie.movieId++;
        this.title = title;
        this.genre = genre;
        this.ticketPrice = ticketPrice;
        this.isShowing = false;
    }
    startShow() {
        this.isShowing = true;
    }
    stopShow() {
        this.isShowing = false;
    }
    abstract calculateTicketCost(quantity: number): number;
    abstract getSpeciaOffers(): string[];
    abstract getMovieInfo(): string;
    getDetails(): void {
        console.log(`Mã phim: ${this.id}, Tên: ${this.title}, Thể loại: ${this.genre}, Giá vé: ${this.ticketPrice}, Đang chiếu: ${this.isShowing}`);
    }

}
class ActionMovie extends Movie{
    constructor(title:string,ticketPrice: number) {
        super(title, "action", ticketPrice);
    }
    calculateTicketCost(quantity: number): number {
        return this.ticketPrice * quantity;
    }
    getSpeciaOffers(): string[] {
        return ["Miễn phí bắp rang", "Tặng poster"];
    }
    getMovieInfo(): string {
        return "Phim hàng động gay cấn, kỹ xảo hành tráng"
    }
}
class ComedyMovie extends Movie{
    constructor(title: string, ticketPrice: number) {
        super(title, "comedy", ticketPrice);
    }
    calculateTicketCost(quantity: number): number {
        let cost = this.ticketPrice * quantity;
        if (quantity > 4) {
            cost *= 0.9;
        }
        return cost;
    }
    getSpeciaOffers(): string[] {
        return ["Giảm 10% cho nhóm trên 4 người"];
    }
    getMovieInfo(): string {
        return "Phim hài nhẹ nhàng,vui nhộn";
    }
}
class AnimationMovie extends Movie{
    constructor(title:string,ticketPrice:number) {
        super(title,"hoạt hình", ticketPrice);
    }
    calculateTicketCost(quantity: number): number {
        let total = 0;
        for (let i = 0; i < quantity; i++){
            if (i % 2 === 1) {
                total += this.ticketPrice * 0.8;
            } else {
                total += this.ticketPrice;
            }
        }
        return total;
    }
    getSpeciaOffers(): string[] {
        return ["Giảm giá cho trẻ em dưới 12 tuổi"];
    }
    getMovieInfo(): string {
        return "Phim hoạt hình với hình ảnh sống động"
    }
}
class TicketBooking{
    private static nextBooking = 1;
    bookingId: number;
    audience: Audience;
    movie: Movie;
    quantity: number;
    totalPrice: number;
    constructor(audience:Audience,movie:Movie,quantity:number) {
        this.bookingId = TicketBooking.nextBooking++;
        this.audience = audience;
        this.movie = movie;
        this.quantity = quantity;
        this.totalPrice = movie.calculateTicketCost(quantity);
    }
    getDetails() {
        console.log(`Mã đặt vé: ${this.bookingId}`);
        console.log(`Khán gải đặt vé: ${this.audience}`);
        console.log(`Phim đã chọn: ${this.movie}`);
        console.log(`Số lượng vé: ${this.quantity}`);
        console.log(`Tổng giá vé: ${this.totalPrice}`);
        
    }
}
class Cinema{
    movies: Movie[]=[];
    audiences: Audience[]=[];
    bookings: TicketBooking[]=[];
    addMovie(movie: Movie): void{
        this.movies.push(movie);
        console.log(`Đã thêm phim: ${movie.title}`);
        
    }
    addAudience(name: string, email: string, phone: string): Audience{
        const audience = new Audience(name, email, phone);
        this.audiences.push(audience);
        console.log(`đã thêm khán giả:${name}`);
        return audience;
        
    }
    bookTickets(audienceId: number, movieId: number, quantity: number): TicketBooking |null{
        const audience = this.findAudienceByid(this.audiences, audienceId);
        const movie = this.findMovieById(this.movies, movieId);
        if (!audience || !movie) {
            console.log("k tìm thấy khán giả, phim");
            return null;
        }
        const booking = new TicketBooking(audience, movie, quantity);
        this.bookings.push(booking);
        console.log(`đặt vé thành công cho phim: ${movie.title}`);
        return booking;
    }
    cancelMovie(movieId: number): void {
        this.movies = this.movies.filter(m => m.id !== movieId);
        console.log(`Đã ngừng chiếu phim Id: ${movieId}`);
    }

    listShowingMovies(): void{
        console.log("danh sách phim đang chiếu: ");
        this.movies.forEach(movie => movie.getDetails());
    }
    listAudienceBookings(audienceId: number): void{
        const audienceBookings = this.bookings.filter(b => b.audience.id === audienceId);
        if (audienceBookings.length === 0) {
            console.log("khán giả chưa đặt được vé nào");
            
        } else {
            audienceBookings.forEach(b => b.getDetails());
        }
    
    }
    calculateTotalRevenue(): number{
        return this.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    }
    getMovieGenreCount(): void{
        const genreCount = this.movies.reduce((countMap, movie) => {
            countMap[movie.genre] = (countMap[movie.genre] || 0) + 1;
            return countMap;
        }, {} as Record<string,number>);
        console.log("số phim theo thể loại: ",genreCount);
        
    }
    getMovieSpecialOffers(movieId: number): void{
        const movie = this.findMovieById(this.movies, movieId);
        if (movie) console.log(`Ưu đãi cho phim ${movie.title}: ${movie.getSpeciaOffers().join(", ")}`);
        else console.log("Không tìm thấy phim");
    }
    findMovieById(collection: Movie[], id: number): Movie | undefined{
        return collection.find(movie => movie.id === id)
    }
    findAudienceByid(collection: Audience[], id: number): Audience | undefined{
        return collection.find(audience => audience.id === id);
    
    }
    findTicketBookingById(collection: TicketBooking[], id: number): TicketBooking | undefined{
        return collection.find(booking => booking.bookingId === id);
    }
}
function showMenu() {
    console.log("1.Thêm khán giả mới.");
    console.log("2.Thêm phim mới (chọn loại: ActionMovie, ComedyMovie, AnimationMovie)");
    console.log("3.Đặt vé (chọn khán giả, chọn phim, nhập số lượng vé).");
    console.log("4.Ngừng chiếu phim. ");
    console.log("5.Hiển thị danh sách phim đang chiếu (filter). ");
    console.log("6.Hiển thị các đặt vé của một khán giả (filter).");
    console.log("7.Tính và hiển thị tổng doanh thu (reduce).");
    console.log("8.Đếm số lượng từng thể loại phim (reduce hoặc map).");
    console.log("9.Tìm kiếm và hiển thị thông tin bằng mã định danh (generic)");
    console.log("10.Hiển thị ưu đãi của một phim (find).");
    console.log("11.Thoát chương trình");
}
const cinema = new Cinema();
for (let choice = 1; choice < 11; choice++){
    showMenu();
    console.log(`banj đã chọn:${choice}`);
    
    switch (choice) {
        case 1:
            cinema.addAudience("Nguyễn Văn A", "a@gmail.com", "0123456789");
            cinema.addAudience("Trần Thị B", "b@gmail.com", "0987654321");
            break;
        case 2:
            cinema.addMovie(new ActionMovie("Avengers", 100000));
            cinema.addMovie(new ComedyMovie("Kungfu Hustle", 80000));
            cinema.addMovie(new AnimationMovie("Frozen", 90000));
            break;
        case 3:
            cinema.bookTickets(1, 1, 2);
            cinema.bookTickets(2, 2, 5);
            break;
        case 4:
            cinema.cancelMovie(3);
            break;
        case 5:
            cinema.listShowingMovies();
            break;
        case 6:
            cinema.listAudienceBookings(2);
            break;
        case 7:
            console.log("Tổng doanh thu:", cinema.calculateTotalRevenue());
            break;
        case 8:
            cinema.getMovieGenreCount();
            break;
        case 9:
            const movie = cinema.findMovieById(cinema.movies, 1);
            if (movie) movie.getDetails()
            break;
        case 10:
            cinema.getMovieSpecialOffers(1);
            break;
        case 11:
            console.log("Thoát chương trình");
            break;
        default:
            console.log("vui lòng lựa chọn lại");
            
    }
}