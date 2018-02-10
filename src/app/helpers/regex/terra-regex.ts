/**
 * @author mkunze
 */
export class TerraRegex
{
    public static getDouble(decimalPlacesCount:number):string
    {
        return '^[-+]?[0-9]*' + (decimalPlacesCount > 0 ? '[\\.,]?[0-9]{0,' + decimalPlacesCount + '}' : '') + '$';
    }

    public static getPositiveDouble(decimalPlacesCount:number):string
    {
        return '^[+]?[0-9]*' + (decimalPlacesCount > 0 ? '[\\.,]?[0-9]{0,' + decimalPlacesCount + '}' : '') + '$';
    }

    public static get PLENTY_CMS_SYNTAX():string
    {
        return this._PLENTY_CMS_SYNTAX;
    }

    public static get ROYAL_MAIL_COUNTRY_CODE():string
    {
        return this._ROYAL_MAIL_COUNTRY_CODE;
    }

    public static get ROYAL_MAIL_CONTRACT_NUMBER():string
    {
        return this._ROYAL_MAIL_CONTRACT_NUMBER;
    }

    public static get COMPLETE_VERSION():string
    {
        return this._COMPLETE_VERSION;
    }

    public static get VERSION():string
    {
        return this._VERSION;
    }

    public static get HTML_LINEBREAK_ENTITY():string
    {
        return this._HTML_LINEBREAK_ENTITY;
    }

    public static get RECOMMENDATIONS_YEAR():string
    {
        return this._RECOMMENDATIONS_YEAR;
    }

    public static get RECOMMENDATIONS_PARTIAL_DATE():string
    {
        return this._RECOMMENDATIONS_PARTIAL_DATE;
    }

    public static get RECOMMENDATIONS_FULL_DATE():string
    {
        return this._RECOMMENDATIONS_FULL_DATE;
    }

    public static get WITHOUT_HTML():string
    {
        return this._WITHOUT_HTML;
    }

    public static get NUMBER_LETTERS():string
    {
        return this._NUMBER_LETTERS;
    }

    public static get IBAN_BIC():string
    {
        return this._IBAN_BIC;
    }

    public static get IP_V4_OR_DOMAIN():string
    {
        return this._IP_V4_OR_DOMAIN;
    }

    public static get PASSWORD_COMBINED():string
    {
        return this._PASSWORD_COMBINED;
    }

    public static get HAS_NUMBERS():string
    {
        return this._HAS_NUMBERS;
    }

    public static get USERNAME_COMBINED():string
    {
        return this._USERNAME_COMBINED;
    }

    public static get UPPERCASE_A_Z():string
    {
        return this._UPPERCASE_A_Z;
    }

    public static get UMLAUTS():string
    {
        return this._UMLAUTS;
    }

    public static get COMMA_DEVIDED():string
    {
        return this._COMMA_DEVIDED;
    }

    public static get CANONICAL():string
    {
        return this._CANONICAL;
    }

    public static get URL():string
    {
        return this._URL;
    }

    public static get INT_PHONE():string
    {
        return this._INT_PHONE;
    }

    public static get IP_V4():string
    {
        return this._IP_V4;
    }

    public static get SIGNED_PERCENTAGE():string
    {
        return this._SIGNED_PERCENTAGE;
    }

    public static get PERCENTAGE():string
    {
        return this._PERCENTAGE;
    }

    public static get SCORE_ALPHA_NUMERIC_POSITIVE_WITH_DOTS():string
    {
        return this._SCORE_ALPHA_NUMERIC_POSITIVE_WITH_DOTS;
    }

    public static get MIXED():string
    {
        return this._MIXED;
    }

    public static get MYSQL_DATE_TIMESTAMP():string
    {
        return this._MYSQL_DATE_TIMESTAMP;
    }

    public static get DATE():string
    {
        return this._DATE;
    }

    public static get EMAIL_FORWARDING():string
    {
        return this._EMAIL_FORWARDING;
    }

    public static get EMAIL_LOCAL_PART():string
    {
        return this._EMAIL_LOCAL_PART;
    }

    public static get EMAIL():string
    {
        return this._EMAIL;
    }

    public static get HEX_COLOR_SHORT():string
    {
        return this._HEX_COLOR_SHORT;
    }

    public static get UPC():string
    {
        return this._UPC;
    }

    public static get ISBN():string
    {
        return this._ISBN;
    }

    public static get WEIGHT():string
    {
        return this._WEIGHT;
    }

    public static get DOUBLE():string
    {
        return this._DOUBLE;
    }

    public static get NUMERIC_EAN_13():string
    {
        return this._NUMERIC_EAN_13;
    }

    public static get NUMERIC_POSITIVE():string
    {
        return this._NUMERIC_POSITIVE;
    }

    public static get START_WITH_CAPITAL():string
    {
        return this._START_WITH_CAPITAL;
    }

    public static get ONLY_STRING_WITH_SLASH_AND_UNDERSCORE():string
    {
        return this._ONLY_STRING_WITH_SLASH_AND_UNDERSCORE;
    }

    public static get NUMERIC():string
    {
        return this._NUMERIC;
    }

    public static get COLOR_HEX():string
    {
        return this._COLOR_HEX
    }

    private static _COLOR_HEX = '^#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?$';
    private static _NUMERIC:string = '^[-+]?\\d+$';
    private static _ONLY_STRING_WITH_SLASH_AND_UNDERSCORE:string = '^([a-zA-Z0-9]+)((\\/|_)([a-zA-Z0-9]+))*$';
    private static _START_WITH_CAPITAL:string = '^[A-Z][A-Za-z]*';
    private static _NUMERIC_POSITIVE:string = '^[1-9]+\\d*';
    private static _NUMERIC_EAN_13:string = '^[0-9]{13}$';
    private static _DOUBLE:string = TerraRegex.getDouble(2);
    private static _WEIGHT:string = '^\\d+([\\.,]0)?$';
    private static _ISBN:string = '^(97(8|9))?\\d{9}(\\d|X)$';
    private static _UPC:string = '\"^[0-9]{0,12}$\"';
    private static _HEX_COLOR_SHORT:string = '^#?([0-9a-f]{3}){1,2}$';
    private static _EMAIL:string = '^[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$';
    private static _EMAIL_LOCAL_PART:string = '^[a-zA-Z0-9_\\-\\.]*$';
    private static _EMAIL_FORWARDING:string = '^[^üÜäÄöÖ!§$%&/{([)=}\\]?\\*+#^°:`µ¤<>|\"\']*$';
    private static _DATE:string = '^\\d{1,2}\\.\\d{1,2}\\.\\d{4}$';
    private static _MYSQL_DATE_TIMESTAMP:string = '^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$';
    private static _MIXED:string = '^.*$';
    private static _SCORE_ALPHA_NUMERIC_POSITIVE_WITH_DOTS:string = '^[a-zA-Z0-9öäüÜÄÖ\\-\\._ ]+$';
    private static _PERCENTAGE:string = '^((100[\\.,][0]*)|100|[0-9]{0,2}|[0-9]{1,2}[\\.,][0-9]{0,3})$';
    private static _SIGNED_PERCENTAGE:string = '^[+-]?((100[\\.,][0]*)|100|[0-9]{0,2}|[0-9]{1,2}[\\.,][0-9]{0,3})$';
    private static _IP_V4:string = '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$';
    private static _INT_PHONE:string = '^\\+?(?:[0-9 \\.-/] ?){5,14}[0-9]$';
    private static _URL:string = '^(http|https|ftp)\\://[a-zA-Z0-9\\-\\.]+\\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\\-\\._\\?\\,\\]\\,\\[\\,\\\'/\\\\\\+&amp;%\\$#\\=~])*$';
    private static _CANONICAL:string = '^(http:\\/\\/|https:\\/\\/)[a-zA-Z0-9]';
    private static _COMMA_DEVIDED:string = '^\\d+[\\, 0-9]*$';
    private static _UMLAUTS:string = '[öäüÖÄÜ]';
    private static _UPPERCASE_A_Z:string = '[A-Z]';
    private static _USERNAME_COMBINED:string = '[^a-zA-Z0-9_\\-\\.]';
    private static _HAS_NUMBERS:string = '[0-9]';
    private static _PASSWORD_COMBINED:string = '[^a-zA-Z0-9äöüÄÖÜ@<\\(\\{\\[/=\\\\\\]\\}\\)>!\\?\\$%&#\\*\\-\\+\\.,;:_\\^\\|~]';
    private static _IP_V4_OR_DOMAIN:string = '(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|(^(?:[a-zA-Z0-9]+(?:\\-*[a-zA-Z0-9])*\\.)+[a-zA-Z]{2,6}$)';
    private static _IBAN_BIC:string = '^[a-zA-Z0-9]+$';
    private static _NUMBER_LETTERS:string = '^[a-zA-Z0-9_]+$';
    private static _WITHOUT_HTML:string = '^[^<]*[^>]*$';
    private static _RECOMMENDATIONS_FULL_DATE:string = '^[0-9]{4}[0-1][0-9][0-3][0-9]$';
    private static _RECOMMENDATIONS_PARTIAL_DATE:string = '^[0-9]{4}[0-1][0-9]$';
    private static _RECOMMENDATIONS_YEAR:string = '^[0-9]{4}$';
    private static _HTML_LINEBREAK_ENTITY:string = '<\\s*/?\\s*br\\s*/?\\s*>';
    private static _VERSION:string = '^[0-9]+\\.[0-9]+$';
    private static _COMPLETE_VERSION:string = '^[0-9]+\\.[0-9]+\\.[0-9]+$';
    private static _ROYAL_MAIL_CONTRACT_NUMBER:string = '^[A-Za-z0-9]{1,12}$';
    private static _ROYAL_MAIL_COUNTRY_CODE:string = '^[A-Z0-9]{3}$';
    private static _PLENTY_CMS_SYNTAX:string = '(\\{%[\\s]*(if|for))([\\s\\S]*)(\\{%[\\s]*(endif|endfor)[\\s]*%\\})';
}
