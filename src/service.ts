import { searchInDatabase, type SearchMode, type WebsiteSearchResult } from "./repository.js";



class SearchService {
    public async run(query: string, mode: SearchMode): Promise<WebsiteSearchResult[]> {
        return await searchInDatabase(query, 0, mode);
    }
}

export default SearchService;


