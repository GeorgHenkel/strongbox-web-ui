import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, ParamMap, Router, RouterEvent} from '@angular/router';
import {BehaviorSubject, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {Breadcrumb} from '../../../../shared/layout/components/breadcrumb/breadcrumb.model';

@Component({
    selector: 'app-browse-repository',
    templateUrl: './browse-repository.component.html',
    styleUrls: ['./browse-repository.component.scss']
})
export class BrowseRepositoryComponent implements OnInit, OnDestroy {

    breadcrumbs: Breadcrumb[] = [];
    loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    path$: BehaviorSubject<string> = new BehaviorSubject(null);
    allowBack$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    storageId;
    repositoryId;

    private destroy$: Subject<any> = new Subject();

    constructor(private route: ActivatedRoute, private router: Router) {
        this.router
            .events
            .pipe(takeUntil(this.destroy$), filter((e: RouterEvent) => e instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                const fullPath = event.url.replace(/^\/admin\/storages\//, '');
                const fullPathArray = fullPath.split('/');
                const storageId = fullPathArray[0];
                const repositoryId = fullPathArray[1];
                fullPathArray.shift(); // remove storageId
                fullPathArray.shift(); // remove repositoryId
                const path = fullPathArray.join('/');

                if (path === '/' || path === null || path === '') {
                    this.allowBack$.next(false);
                } else {
                    this.allowBack$.next(true);
                }

                this.breadcrumbs = [
                    {url: ['/admin/storages'], label: 'Storages'},
                    {url: ['/admin/storages', storageId], label: storageId},
                    {url: ['/admin/storages', storageId, repositoryId], label: repositoryId},
                    {url: ['/admin/storages', storageId, repositoryId], label: 'Directory listing', active: true}
                ];

                this.path$.next(fullPath);
            });
    }

    ngOnInit() {
        this.route
            .paramMap
            .pipe(takeUntil(this.destroy$))
            .subscribe((params: ParamMap) => {
                this.storageId = params.get('storageId');
                this.repositoryId = params.get('repositoryId');
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
