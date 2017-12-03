export function ShowCompare(show1, show2) {
    return show1.title == show2.title && show1.season == show2.season && show1.episode == show2.episode;
}