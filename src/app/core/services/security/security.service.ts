import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityService {

    private readonly logger = new Logger(SecurityService.name);

    /**
     * Constructor
     */
    constructor(
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    isSameUsername(currentUsername, requestingUsername)
    {
        if (currentUsername === requestingUsername)
            return true;
        
        return false;
    }
}