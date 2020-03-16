import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ChartsModule} from 'ng2-charts';

import {MaterialModule} from '../../../../../../shared/material.module';

import {JvmMemoryStatsComponent} from './jvm-memory-stats.component';

describe('JvmMemoryStatsComponent', () => {
    let component: JvmMemoryStatsComponent;
    let fixture: ComponentFixture<JvmMemoryStatsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                MaterialModule,
                HttpClientTestingModule,
                RouterTestingModule,
                ChartsModule
            ],
            declarations: [JvmMemoryStatsComponent]
        });

        fixture = TestBed.createComponent(JvmMemoryStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

});
