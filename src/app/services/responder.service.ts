import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { MessageService } from './message.service';
import { of } from 'rxjs/internal/observable/of';
import { Responder } from '../models/responder';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ResponderService {

  constructor(private messageService: MessageService, private http: HttpClient, private socket: Socket) { }

  getTotal(): Observable<any> {
    const url = 'responder-service/stats';
    return this.http.get<any>(url).pipe(
      catchError(res => this.handleError('getTotal()', res))
    );
  }

  getAvailable(): Observable<Responder[]> {
    const url = 'responder-service/responders/available';
    return this.http.get<Responder[]>(url).pipe(
      catchError(res => this.handleError('getAvailable()', res))
    );
  }

  getByName(name: string): Observable<Responder> {
    const url = `responder-service/responder/byname/${name}`;
    return this.http.get<Responder>(url).pipe(
      catchError(res => this.handleError('getResponder()', res))
    );
  }

  getById(id: number): Observable<Responder> {
    const url = `responder-service/responder/${id}`;
    return this.http.get<Responder>(url).pipe(
      catchError(res => this.handleError('getById()', res))
    );
  }

  add(responder: Responder): Observable<any> {
    delete responder.id;
    const url = 'responder-service/responder';
    return this.http.post<any>(url, responder).pipe(
      catchError(res => this.handleError('add()', res))
    );
  }

  update(responder: Responder): Observable<any> {
    const url = 'responder-service/responder';
    return this.http.put<any>(url, responder).pipe(
      catchError(res => this.handleError('update()', res))
    );
  }

  watch(responder: Responder): Observable<any> {
    return Observable.create(observer => {
      this.socket.on('topic-responder-event', update => {
        console.log('Responder watch', update);
        if (!update || update.responderId !== `${responder.id}`) {
          return;
        }
        observer.next(update);
      });
    });
  }

  watchLocation(responder: Responder): Observable<any> {
    return Observable.create(observer => {
      this.socket.on('topic-responder-location-update', update => {
        if (!update || update.responderId !== `${responder.id}`) {
          return;
        }
        observer.next(update);
      });
    });
  }

  private handleError(method: string, res: HttpErrorResponse): Observable<any> {
    if (res.status === 404 && method === 'getResponder()') {
      return of(new Responder());
    } else {
      this.messageService.error(`${method} ${res.message}`);
      console.error(res.error);
      return of(null);
    }
  }
}
