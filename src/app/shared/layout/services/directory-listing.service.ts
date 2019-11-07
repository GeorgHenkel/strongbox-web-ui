import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {plainToClass, Transform, Type} from 'class-transformer';

export class PathContent {
    @Type(() => PathRecord)
    @Transform(
        (array: PathRecord[]) => array.map((p) => {
            return {...p, type: 'directory'};
        }), {toClassOnly: true}
    )
    directories: PathRecord[];

    @Type(() => PathRecord)
    @Transform(
        (array: PathRecord[]) => array.map((p) => {
            return {...p, type: 'file'};
        }), {toClassOnly: true}
    )
    files: PathRecord[];
}

export class PathRecord {
    artifactPath: string;
    lastModified: string;
    repositoryId: string;
    storageId: string;
    size: any;
    url: string;
    name: string;
    type: 'file' | 'directory' | 'back' = 'back';
    description: string;

    constructor(name: string, type) {
        this.name = name;
        this.type = type;
    }
}

@Injectable({
    providedIn: 'root'
})
export class DirectoryListingService {

    constructor(private http: HttpClient) {
    }

    /**
     * @param apiUrl - the base API url which will be used to retrieve the records (i.e. `/api/browse`; `/api/storages/etc`)
     * @param path - the path which will be retrieved (i.e. `/`, `/somewhere`)
     * @param allowBack
     */
    getDirectoryListing(apiUrl: string = '/api/browse', path: string = '', allowBack: boolean = false): Observable<any> {
        if (path === null) {
            path = '';
        }

        return this.http
                   .get(`${apiUrl}/${path}`)
                   .pipe(
                       map((r: any) => plainToClass(PathContent, r) as any),
                       switchMap((records: PathContent) => {
                           if (allowBack) {
                               records.directories = [
                                   new PathRecord('..', 'back'),
                                   ...records.directories
                               ];
                           }

                           return of(records);
                       })
                   );

    }
}
