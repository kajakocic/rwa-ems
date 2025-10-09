import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'firstSentence',
    standalone: true,
})
export class FirstSentence implements PipeTransform{
    transform(value: string): string {
        if(!value) return '';
        const firstSentence = value.split('. ')[0];
        return firstSentence.endsWith('.') ? firstSentence : firstSentence + '.';
    }
}
