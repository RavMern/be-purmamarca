import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as url from 'url';

const databaseConfig = (): DataSourceOptions => {
  // Check for DB_URL or DATABASE_URL (Supabase often uses DATABASE_URL)
  const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;

  // If DB_URL or DATABASE_URL is provided, use it directly (for Supabase)
  if (dbUrl) {
    const isSupabase = dbUrl.includes('supabase');

    // Early logging to help diagnose issues
    if (isSupabase) {
      const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
      const urlSource = process.env.DB_URL ? 'DB_URL' : 'DATABASE_URL';
      console.log(
        `\n🔍 Detected Supabase connection string from ${urlSource}: ${maskedUrl}`
      );
    }

    // Parse URL to extract components for better control
    const parsedUrl = url.parse(dbUrl, true); // true = parseQueryString
    const auth = parsedUrl.auth ? parsedUrl.auth.split(':') : [];
    // Decode username and password in case they contain URL-encoded characters
    const username = auth[0] ? decodeURIComponent(auth[0]) : '';
    const password = auth[1] ? decodeURIComponent(auth[1]) : '';
    const database = parsedUrl.pathname
      ? decodeURIComponent(parsedUrl.pathname.slice(1))
      : 'postgres';

    // For Supabase, check if using pooler or direct connection
    let hostname = parsedUrl.hostname || 'localhost';
    let port = parseInt(parsedUrl.port || '5432', 10);
    let finalUsername = username; // Will be modified for pooler

    if (isSupabase) {
      // IMPORTANT: Extract project ref from ORIGINAL hostname BEFORE potentially changing it
      // This is needed for pooler username construction
      // Also try to extract from username if already in pooler format (postgres.PROJECT_REF)
      let originalProjectRef = parsedUrl.hostname?.match(
        /db\.([^.]+)\.supabase\.co/
      )?.[1];

      // If we can't get it from hostname, try to extract from username (might already be pooler URL)
      if (!originalProjectRef && username.includes('.')) {
        // Username format: postgres.PROJECT_REF
        const match = username.match(/^[^.]+\.(.+)$/);
        if (match) {
          originalProjectRef = match[1];
        }
      }

      // Check if already using pooler (contains 'pooler' or port 6543)
      const isUsingPooler = hostname.includes('pooler') || port === 6543;

      // Allow forcing direct connection instead of pooler via environment variable
      const useDirectConnection = process.env.SUPABASE_USE_DIRECT === 'true';

      // If DB_URL is already a pooler URL with correct username format, use it as-is
      // UNLESS we're forcing direct connection
      if (!useDirectConnection && isUsingPooler && username.includes('.')) {
        console.log(
          `✅ DB_URL is already a pooler URL with correct format - using as-is`
        );
        console.log(`   Host: ${hostname}:${port}`);
        console.log(`   Username: ${username}`);
        // Don't modify anything, use the DB_URL directly
      } else if (useDirectConnection) {
        // Force direct connection (useful for debugging or if pooler doesn't work)
        console.log(
          `\n⚠️  Using DIRECT connection (bypassing pooler) as requested by SUPABASE_USE_DIRECT=true`
        );
        console.log(
          `   This uses port 5432 directly. Note: Direct connections have connection limits.\n`
        );
        // For direct connection, use the original hostname from DB_URL (db.PROJECT_REF.supabase.co)
        // and port 5432
        hostname = parsedUrl.hostname || hostname;
        port = 5432;
        // Username should be just 'postgres' for direct connection (not postgres.PROJECT_REF)
        if (finalUsername.includes('.')) {
          // Extract base username if it was in pooler format
          const baseUser = finalUsername.split('.')[0];
          finalUsername = baseUser || 'postgres';
          console.log(`   Using direct connection username: ${finalUsername}`);
        } else if (!finalUsername) {
          finalUsername = 'postgres';
        }
      } else if (!isUsingPooler) {
        // Try to get pooler URL from environment variable first
        const poolerUrl = process.env.SUPABASE_POOLER_URL;
        if (poolerUrl) {
          // Parse the pooler URL if provided (can be full URL or just hostname:port)
          if (poolerUrl.includes('://')) {
            const poolerParsed = url.parse(poolerUrl);
            hostname = poolerParsed.hostname || hostname;
            port = parseInt(poolerParsed.port || '6543', 10);
            // If pooler URL has username, use it only if it's already in correct format
            // Otherwise, we'll construct it later using originalProjectRef
            if (poolerParsed.auth) {
              const poolerAuthParts = poolerParsed.auth.split(':');
              const poolerUsername = poolerAuthParts[0]
                ? decodeURIComponent(poolerAuthParts[0])
                : '';
              // Only use pooler URL username if it already has project ref
              if (poolerUsername.includes('.')) {
                finalUsername = poolerUsername;
                // Also extract project ref from pooler username if we don't have it yet
                if (!originalProjectRef) {
                  const match = poolerUsername.match(/^[^.]+\.(.+)$/);
                  if (match) {
                    originalProjectRef = match[1];
                  }
                }
              }
              // Note: DB_URL password takes precedence over pooler URL password
            }
          } else {
            // Just hostname:port format
            const [poolerHost, poolerPort] = poolerUrl.split(':');
            hostname = poolerHost;
            port = parseInt(poolerPort || '6543', 10);
          }
          console.log(`✅ Using Supabase Session Pooler: ${hostname}:${port}`);
        } else {
          // SUPABASE_POOLER_URL is not set - we need it for reliable connection
          console.error(
            '\n❌ SUPABASE_POOLER_URL is not set!\n' +
              '⚠️  The fallback pooler URL may not work for your region.\n\n' +
              '📋 To fix this, please:\n' +
              '   1. Go to your Supabase Dashboard\n' +
              '   2. Navigate to: Settings > Database > Connection Pooling\n' +
              '   3. Select "Session" mode\n' +
              '   4. Copy the "Connection string" or "Host" value\n' +
              '   5. Set it in your .env file as:\n' +
              '      SUPABASE_POOLER_URL=aws-X-REGION.pooler.supabase.com:6543\n' +
              '      (or the full connection string)\n\n' +
              '   Example:\n' +
              '   SUPABASE_POOLER_URL=aws-0-us-east-2.pooler.supabase.com:6543\n\n'
          );

          if (originalProjectRef) {
            console.warn(
              '⚠️  Attempting fallback pooler (this may fail if region is incorrect)...'
            );
            console.warn(
              `\n💡 TIP: If this fails, you can:\n` +
                `   1. Set SUPABASE_POOLER_URL with correct region from Supabase Dashboard\n` +
                `   2. OR use direct connection by setting: SUPABASE_USE_DIRECT=true\n\n`
            );
            // Try common pooler format - this may not work for all regions
            // Common regions: us-east-1, us-west-1, eu-west-1, ap-northeast-1, us-east-2
            hostname = `aws-0-us-east-1.pooler.supabase.com`;
            port = 6543;
            console.warn(`⚠️  Using fallback pooler: ${hostname}:${port}`);
            console.warn(
              `   If connection fails, you MUST set SUPABASE_POOLER_URL with your correct region.\n`
            );
          } else {
            throw new Error(
              '❌ Could not extract Supabase project reference from DB_URL.\n' +
                'Please ensure DB_URL is in the correct format (db.PROJECT_REF.supabase.co) ' +
                'or set SUPABASE_POOLER_URL in .env with your pooler URL from Supabase Dashboard.'
            );
          }
        }
      } else {
        // Already using pooler URL from DB_URL
        console.log(
          `✅ Using pooler connection from DB_URL: ${hostname}:${port}`
        );
      }

      // IMPORTANT: For Supabase pooler, username must include project reference
      // Format: postgres.[PROJECT_REF]
      // For direct connections, username should be just 'postgres'
      // Use the original project ref extracted before hostname was potentially changed
      // Skip if DB_URL was already a pooler URL with correct username format
      // Skip if using direct connection
      const isActuallyUsingPooler =
        (isUsingPooler || hostname.includes('pooler')) && !useDirectConnection;
      const needsUsernameUpdate =
        isActuallyUsingPooler && !finalUsername.includes('.');

      if (needsUsernameUpdate) {
        // Username for pooler must be: postgres.[PROJECT_REF]
        if (originalProjectRef) {
          finalUsername = `postgres.${originalProjectRef}`;
          console.log(`✅ Updated username for pooler: ${finalUsername}`);
        } else {
          console.error(
            `❌ ERROR: Cannot construct pooler username - project reference not found!\n` +
              `   DB_URL hostname: ${parsedUrl.hostname}\n` +
              `   DB_URL username: ${username}\n` +
              `   DB_URL/DATABASE_URL: ${dbUrl ? dbUrl.replace(/:[^:@]+@/, ':****@') : 'not set'}\n` +
              `\n   Solutions:\n` +
              `   1. Ensure DB_URL/DATABASE_URL includes project ref: db.PROJECT_REF.supabase.co\n` +
              `   2. Use pooler URL format: postgresql://postgres.PROJECT_REF:PASSWORD@aws-X-REGION.pooler.supabase.com:6543/postgres\n` +
              `   3. Set SUPABASE_POOLER_URL with complete connection string from Supabase Dashboard`
          );
          throw new Error(
            'Cannot construct Supabase pooler username: project reference not found. ' +
              'Please check your DB_URL format or SUPABASE_POOLER_URL configuration.'
          );
        }
      } else if (isActuallyUsingPooler) {
        console.log(
          `✅ Username already in correct pooler format: ${finalUsername}`
        );
      } else if (useDirectConnection) {
        console.log(`✅ Using direct connection username: ${finalUsername}`);
      }

      // Debug logging (always show for Supabase to help with troubleshooting)
      console.log(`📊 Final Database Connection Config:`);
      console.log(`   Host: ${hostname}`);
      console.log(`   Port: ${port}`);
      console.log(`   Username: ${finalUsername}`);
      console.log(`   Database: ${database}`);
      console.log(
        `   Password: ${password ? '***' + password.slice(-2) : '(not set)'}`
      );
      if (originalProjectRef) {
        console.log(`   Project Ref: ${originalProjectRef}`);
      }
      console.log(`   Using Pooler: ${isActuallyUsingPooler}`);
      console.log(`   Using Direct: ${useDirectConnection}`);

      // Show helpful troubleshooting info if connection might fail
      if (isActuallyUsingPooler && hostname.includes('aws-0-us-east-1')) {
        console.warn(
          `\n⚠️  WARNING: Using fallback pooler hostname (aws-0-us-east-1)\n` +
            `   This may not work if your project is in a different region.\n\n` +
            `   Solutions:\n` +
            `   1. Set SUPABASE_POOLER_URL with correct region from Supabase Dashboard\n` +
            `   2. Use direct connection: Set SUPABASE_USE_DIRECT=true in .env\n\n`
        );
      }

      if (useDirectConnection) {
        console.warn(
          `\n⚠️  Note: Direct connections have connection limits.\n` +
            `   For production, use the pooler with correct SUPABASE_POOLER_URL.\n`
        );
      }
    }

    // Build config object with all properties from the start
    const config: DataSourceOptions = {
      type: 'postgres',
      host: hostname,
      port: port,
      username: finalUsername,
      password: password,
      database: database,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      dropSchema: false,
      logging: process.env.NODE_ENV === 'development',
      // Supabase requires SSL
      ...(isSupabase && {
        ssl: { rejectUnauthorized: false },
        extra: {
          options: '-c statement_timeout=30000',
        },
      }),
    };

    return config;
  }

  // Fallback to individual variables for backward compatibility
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'purmamarca_db',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    dropSchema: false,
    logging: process.env.NODE_ENV === 'development',
  };
};

export default registerAs('typeorm', databaseConfig);

const connectionSource: DataSource = new DataSource(databaseConfig());

export { connectionSource };
